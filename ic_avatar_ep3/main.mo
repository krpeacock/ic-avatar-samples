import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

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

    type Error = {
        #NotFound;
        #AlreadyExists;
    };

    // Application state
    stable var profiles : Trie.Trie<Nat, Profile> = Trie.empty();

    stable var next : Nat = 1;

    // Application interface

    // Create a profile
    public func create (profile: Profile) : async Result.Result<(), Error> {
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
                #ok(());
            };
            // Matches pattern of type - opt Profile
            case (? v) {
                #err(#AlreadyExists);
            };
        };
    };

    // Read profile
    public func read (profileId : Nat) : async Result.Result<Profile, Error> {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );
        return Result.fromOption(result, #NotFound);
    };

    // Update profile
    public func update (profileId : Nat, profile : Profile) : async Result.Result<(), Error> {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );

        switch (result){
            // Do not allow updates to profiles that haven't been created yet
            case null {
                #err(#NotFound)
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(profileId),     // Key
                    Nat.equal,          // Equality checker
                    ?profile
                ).0;
                #ok(());
            };
        };
    };

    // Delete profile
    public func delete (profileId : Nat) : async Result.Result<(), Error> {
        let result = Trie.find(
            profiles,           //Target Trie
            key(profileId),     // Key
            Nat.equal           // Equality Checker
        );

        switch (result){
            // Do not try to delete a profile that hasn't been created yet
            case null {
                #err(#NotFound);
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           // Target trie
                    key(profileId),     // Key
                    Nat.equal,          // Equality checker
                    null
                ).0;
                #ok(());
            };
        };
    };

    private func key(x : Nat) : Trie.Key<Nat> {
        return { key = x; hash = Hash.hash(x) }
    };
}
