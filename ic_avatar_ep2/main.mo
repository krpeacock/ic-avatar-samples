import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

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
        bio: Bio;
    };

    // Application state
    stable var profiles : Trie.Trie<Nat, Profile> = Trie.empty();

    stable var next : Nat = 1;

    // Application interface

    // Create a profile
    public func create (profile: Profile) : async Bool {
        let profileId = next;
        next += 1;

        let (newProfiles, existing) = Trie.put(
            profiles,           // Target trie
            key(profileId),     // Key
            Nat.equal,          // Equality checker
            profile
        );

        // If there is an original value, do not update
        switch(existing) {
            // If there are no matches, update profiles
            case null {
                profiles := newProfiles;
            };
            // Matches pattern of type - opt Profile
            case (? v) {
                return false;
            };
        };

        return true;
    };

    // Read profile
    public func read (profileId : Nat) : async ?Profile {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );
        return result;
    };

    // Update profile
    public func update (profileId : Nat, profile : Profile) : async Bool {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );

        switch (result){
            // Do not allow updates to profiles that haven't been created yet
            case null {
                return false;
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(profileId),     // Key
                    Nat.equal,          // Equality checker
                    ?profile
                ).0;
            };
        };

        return true;
    };

    // Update profile
    public func delete (profileId : Nat) : async Bool {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );

        switch (result){
            // Do not allow updates to profiles that haven't been created yet
            case null {
                return false;
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(profileId),     // Key
                    Nat.equal,          // Equality checker
                    null
                ).0;
            };
        };

        return true;
    };

    private func key(x : Nat) : Trie.Key<Nat> {
        return { key = x; hash = Hash.hash(x) }
    };
}
