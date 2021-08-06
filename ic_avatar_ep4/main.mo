import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor Avatar {
    type Bio = {
        givenName: ?Text;
        familyName: ?Text;
        name: ?Text;
        displayName: ?Text;
        location: ?Text;
        about: ?Text;
    };

    type Profile = {
        id: Principal;
        bio: Bio;
    };

    type ProfileUpdateObj = {
        bio: Bio;
    };

    type Error = {
        #NotFound;
        #AlreadyExists;
    };

    type Result = Result.Result<(), Error>;

    // Application state
    stable var profiles : Trie.Trie<Principal, Profile> = Trie.empty();


    // Application interface

    // Create a profile
    public shared(msg) func create (profile: ProfileUpdateObj) : async Result {
        // Get caller principal
        let callerId = msg.caller;

        // Associate user profile with with their principal
        let userProfile: Profile = {
            id = callerId;
            bio = profile.bio;
        };

        let (newProfiles, existing) = Trie.put(
            profiles,           // target Trie
            key(callerId),     // key to insert at
            Principal.equal,   // matching function
            userProfile         // data to insert
        );

        // If there is an original value, do not update
        switch(existing) {
            // If there are no matches, update profiles
            case null {
                profiles := newProfiles;
             
                #ok(());
            };
            // Matches pattern of type - opt Profile
            case (? v) {
                #err(#AlreadyExists);
            };
        };

    };

    // Read profile
    public shared(msg) func read () : async Result.Result<Profile, Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),     // Key
            Principal.equal    // Equality Checker
        );
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                #ok(v);
            };
        }
    };

    // Update profile
    public shared(msg) func update (profile : ProfileUpdateObj) : async Result {
        let callerId = msg.caller;
        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),     // Key
            Principal.equal    // Equality Checker
        );

        // Associate user profile with with their principal
        let userProfile: Profile = {
            id = callerId;
            bio = profile.bio;
        };

        switch (result){
            // Do not allow updates to profiles that haven't been created yet
            case null {
                #err(#NotFound);
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(callerId),     // Key
                    Principal.equal,   // Equality checker
                    ?userProfile
                ).0;

                #ok(());
            };
        };

    };

    // Delete profile
    public shared(msg) func delete () : async Result {
        let callerId = msg.caller;
        let result = Trie.find(
            profiles,           //Target Trie
            key(callerId),     // Key
            Principal.equal    // Equality Checker
        );

        switch (result){
            case null {
                #err(#NotFound);
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(callerId),     // Key
                    Principal.equal,   // Equality checker
                    null
                ).0;

                #ok(());
            };
        };

    };

    private func key(x : Principal) : Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) }
    };
}
