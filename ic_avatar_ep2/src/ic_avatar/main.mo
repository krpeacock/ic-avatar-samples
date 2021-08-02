import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Bool "mo:base/Bool";
import Nat32 "mo:base/Nat32";

actor Avatar {
    type GivenName = Text;
    type FamilyName = Text;
    type Name = Text;
    type DisplayName = Text;
    type Location = Text;
    type About = Text;

    type Bio = {
        givenName: ?GivenName;
        FamilyName: ?FamilyName;
        name: ?Name;
        displayName: ?DisplayName;
        location: ?Location;
        about: ?About;
    };

    type Profile = {
        bio: Bio;
    };

    // Application state
    private stable var profiles : Trie.Trie<Nat32, Profile> = Trie.empty();

    private stable var next : Nat32 = 1;
    
    // Create a profile
    public func create (profile: Profile) : async Bool {
        let profileId = next;
        next += 1;

        profiles := Trie.put(
            profiles,           // Target Trie
            key(profileId),     // Key
            Nat32.equal,        // Equality checker
            profile             // data to insert
        ).0;

        return true;
    };

    // Read data
    public query func read(profileId: Nat32) : async ?Profile {
        let result = Trie.find(profiles, key(profileId), Nat32.equal);
        return result;
    };

    // Update profile
    public func update(profileId: Nat32, profile: Profile) : async Bool {
        let result = Trie.find(profiles, key(profileId), Nat32.equal);
        switch (result){
            case null {
                return false;
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // target Trie
                    key(profileId),     // Key
                    Nat32.equal,        // Equality checker
                    ?profile            // Replacement data
                ).0;
            };
        };
        return true;
    };

     // Delete profile
    public func delete(profileId: Nat32) : async Bool {
        let result = Trie.find(profiles, key(profileId), Nat32.equal);
        switch (result){
            case null {
                return false;
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // target Trie
                    key(profileId),     // Key
                    Nat32.equal,        // Equality checker
                    null,               // Replacement data
                ).0;
            };
        };
        return true;
    };

    private func key(x : Nat32) : Trie.Key<Nat32> {
        return { key = x; hash = x };
    };

}
