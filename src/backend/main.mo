import Time "mo:core/Time";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Transaction {
    public func compare(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Int.compare(transaction1.date, transaction2.date);
    };
  };

  type PaymentId = Nat;
  type TransactionId = Nat;

  type TransactionStatus = {
    #paid;
    #pending;
    #failed;
  };
  
  type Transaction = {
    id : TransactionId;
    date : Int;
    phoneNumber : Text;
    provider : Text;
    amount : Float;
    status : TransactionStatus;
  };

  type PaymentMethod = {
    id : PaymentId;
    cardNumber : Text;
    cardHolderName : Text;
    cardType : Text;
    owner : Principal;
  };

  type BillPayment = {
    phoneNumber : Text;
    amount : Float;
    provider : Text;
    paymentMethodId : PaymentId;
  };

  public type UserRole = AccessControl.UserRole;

  public type UserProfile = {
    name : Text;
  };

  type DashboardStats = {
    totalPaidAmount : Float;
    transactionsThisMonth : Nat;
  };

  let paymentMethods = Map.empty<PaymentId, PaymentMethod>();
  let transactions = Map.empty<Principal, List.List<Transaction>>();
  let transactionHistory = Map.empty<TransactionId, Transaction>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextPaymentId = 0;
  var nextTransactionId = 0;

  func getNextPaymentId() : PaymentId {
    let id = nextPaymentId;
    nextPaymentId += 1;
    id;
  };

  func getNextTransactionId() : TransactionId {
    let id = nextTransactionId;
    nextTransactionId += 1;
    id;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Payment Methods Management
  public shared ({ caller }) func addPaymentMethod(cardNumber : Text, cardHolderName : Text, cardType : Text) : async PaymentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add payment methods");
    };
    let id = getNextPaymentId();
    let paymentMethod : PaymentMethod = {
      id;
      cardNumber;
      cardHolderName;
      cardType;
      owner = caller;
    };
    paymentMethods.add(id, paymentMethod);
    id;
  };

  public query ({ caller }) func listPaymentMethods() : async [PaymentMethod] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list payment methods");
    };
    let userMethods = paymentMethods.values().toArray().filter(
      func(pm : PaymentMethod) : Bool { pm.owner == caller }
    );
    userMethods.sort<PaymentMethod>(
      func(a : PaymentMethod, b : PaymentMethod) : Order.Order {
        Nat.compare(b.id, a.id)
      }
    );
  };

  public shared ({ caller }) func removePaymentMethod(id : PaymentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove payment methods");
    };
    switch (paymentMethods.get(id)) {
      case (null) { Runtime.trap("Payment method not found") };
      case (?paymentMethod) {
        if (paymentMethod.owner != caller) { 
          Runtime.trap("Unauthorized: Cannot remove payment method") 
        };
        paymentMethods.remove(id);
      };
    };
  };

  // Bill Payment
  public shared ({ caller }) func submitBillPayment(billPayment : BillPayment) : async TransactionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit bill payments");
    };
    switch (paymentMethods.get(billPayment.paymentMethodId)) {
      case (null) { Runtime.trap("Payment method not found") };
      case (?paymentMethod) {
        if (paymentMethod.owner != caller) { 
          Runtime.trap("Unauthorized: Payment method does not belong to caller") 
        };
        let id = getNextTransactionId();
        let transaction : Transaction = {
          id;
          date = Time.now();
          phoneNumber = billPayment.phoneNumber;
          provider = billPayment.provider;
          amount = billPayment.amount;
          status = #paid;
        };
        let user = caller;
        let userTransactions = switch (transactions.get(user)) {
          case (null) { List.empty<Transaction>() };
          case (?existing) { existing };
        };
        userTransactions.add(transaction);
        transactions.add(user, userTransactions);
        transactionHistory.add(id, transaction);
        id;
      };
    };
  };

  // Transaction History
  public query ({ caller }) func getTransactionHistory() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get transaction history");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?userTransactions) { 
        userTransactions.toArray().sort<Transaction>(
          func(a : Transaction, b : Transaction) : Order.Order {
            Int.compare(b.date, a.date)
          }
        )
      };
    };
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };
    
    switch (transactions.get(caller)) {
      case (null) { 
        { totalPaidAmount = 0.0; transactionsThisMonth = 0 }
      };
      case (?userTransactions) {
        let now = Time.now();
        let thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1_000_000_000);
        
        var totalPaid : Float = 0.0;
        var monthCount : Nat = 0;
        
        for (tx in userTransactions.values()) {
          if (tx.status == #paid) {
            totalPaid += tx.amount;
            if (tx.date >= thirtyDaysAgo) {
              monthCount += 1;
            };
          };
        };
        
        { 
          totalPaidAmount = totalPaid; 
          transactionsThisMonth = monthCount 
        }
      };
    };
  };
};
