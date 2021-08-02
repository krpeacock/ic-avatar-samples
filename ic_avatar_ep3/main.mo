import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Nat "mo:base/Nat";
import Trie "mo:base/Trie";
import Bool "mo:base/Bool";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Option "mo:base/Option";


actor Avatar {
    type Response = {
        code: Nat;
        success: Bool;
        message: Text;
    };
    // Biographic info  
    type GivenName = Text;
    type FamilyName = Text;
    type Name = Text;
    type DisplayName = Text;
    type Location = Text;
    type About = Text;
    
    // Additional Info
    type Wallet = Text;
    type Website = Text;
    type UserPrincipal = Principal;
    type IntegrationPrincipal = Principal;

    type Bio = {
        givenName: ?GivenName;
        familyName: ?FamilyName;
        name: ?Name;
        displayName: ?DisplayName;
        location: ?Location;
        about: ?About;
    };

    type Profile = {
        id: Principal;
        bio: Bio;
        wallets: ?[Wallet];
    };

    type ProfileUpdateObj = {
        bio: Bio;
        wallets: ?[Wallet];
    };

    /**
    * Application State
    */

    // The profile data store
    private stable var profiles : Trie.Trie<Principal, Profile> = Trie.empty();

    /**
    * High-Level API
    */

    // Create a profile.
    public shared (msg) func create(profile : ProfileUpdateObj) : async Result.Result<Profile, Response> {
        // Get caller principal
        let callerId = msg.caller;

        // Associate user profile with with their principal
        let userProfile: Profile = {
            id = callerId;
            bio = profile.bio;
            wallets = profile.wallets;
        };

        profiles := Trie.put(
            profiles,          // target Trie
            key callerId,     // key to insert at
            Principal.equal,  // matching function
            userProfile        // data to insert
        ).0;

        let response: Response = {
            code = 201; // Created success code
            success = true;
            message = Text.concat("Successfully created profile for principal ", Principal.toText(callerId));
        };

        let result = Option.unwrap(Trie.find(profiles, key callerId, Principal.equal));
        #ok(result);
    };

    // Read a profile.
    public query (msg) func read() : async Result.Result<Profile, Response> {
        // Get caller principal
        let callerId = msg.caller;

        switch (Trie.find(profiles, key callerId, Principal.equal)) {
            case null {
                #err({
                    code = 404; // profile does not exist
                    success = false;
                    message = Text.concat("Profile does not exist for: ", Principal.toText(callerId));
                })
            };
            case (? v) {
                #ok(v);
            }
        }
    };

    // // Update a profile.
    public shared (msg) func update(profile: ProfileUpdateObj) : async Result.Result<Response, Response> {
        let callerId = msg.caller;        

        let result = Trie.find(profiles, key(callerId), Principal.equal);
        let exists = Option.isSome(result);

        // Associate user profile with with their principal
        let userProfile: Profile = {
            id = callerId;
            bio = profile.bio;
            wallets = profile.wallets;
        };

        if (exists) {
            profiles := Trie.replace(
                profiles,
                key(callerId),
                Principal.equal,
                ?userProfile,
            ).0;

            #ok({
                code = 200;
                success = true;
                message = "Profile updated successfully";
            });
        }
        else {
            #err({
                code = 404;
                success = false;
                message = "Profile was not available to be updated";
            });
        }
    };

    // // Delete a profile.
    public shared (msg) func delete() : async Result.Result<Response, Response> {
        let callerId = msg.caller;        

        switch (Trie.find(profiles, key callerId, Principal.equal)) {
            case null {
                #err({
                    code = 410;
                    success = false;
                    message = "Profile was not available to be deleted";
                });
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,
                    key(callerId),
                    Principal.equal,
                    null,
                ).0;
                #ok({
                    code = 200;
                    success = true;
                    message = "Profile deleted successfully";
                });
            }
        }
    };

    // Create a trie key from a profile identifier.
    private func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash x; };
    };
};
 