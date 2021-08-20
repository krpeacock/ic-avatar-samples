import { ActorSubclass } from "@dfinity/agent";
import * as React from "react";
import { canisterId, createActor } from "../../../declarations/avatar";
import {
  Profile,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import CreateProfile from "./CreateProfile";
import Loader from "./Loader";
import ManageProfile from "./ManageProfile";
var ls = require("local-storage");
import toast from "react-hot-toast";
import { get, remove, set } from "local-storage";

interface Props {}

export function compareProfiles(p1: any | null, p2: any) {
  console.log(p1);
  console.log(p2);
  if (!p1) return false;

  for (const key in p1.bio) {
    if (Object.prototype.hasOwnProperty.call(p1.bio, key)) {
      const element = p1.bio[key];
      if (element[0] !== p2.bio[key][0]) return false;
    }
  }
  return true;
}

function Home(props: Props) {
  const [profile, setProfile] = React.useState<
    ProfileUpdate | null | undefined
  >(undefined);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);
  const { actor, authClient } = React.useContext(AppContext);

  React.useEffect(() => {
    const storedProfile = ls.get("profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile) as ProfileUpdate);
    } else {
      setProfile(null);
    }
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    // Return if we haven't checked localstorage yet
    console.trace("home before check");
    if (profile === undefined || hasFetched) return;
    setHasFetched(true);

    if (profile === null) {
      toast.loading("Checking for an existing Avatar");
    }

    if (!actor) {
      const actor = createActor(canisterId as string, {
        agentOptions: {
          identity: authClient?.getIdentity(),
        },
      });

      actor.read().then((fetchedProfile) => {
        if ("ok" in fetchedProfile) {
          const profileOptions = { bio: { ...fetchedProfile.ok.bio } };
          // Check if any changes
          if (compareProfiles(profile, profileOptions)) {
            return;
          } else {
            setProfile(profileOptions);

            // Save profile locally
            toast.success("Profile loaded from IC");
            set("profile", JSON.stringify(profileOptions));
          }
        } else {
          console.log(fetchedProfile.err);
          if (get("profile")) {
            remove("profile");
            toast.error("Failed to load profile from IC");
            setProfile(null);
          }
        }
      });
    }
  }, [actor, profile, isLoaded]);

  return (
    <section>
      {profile ? (
        <ManageProfile profile={profile} setProfile={setProfile} />
      ) : (
        <CreateProfile setProfile={setProfile} />
      )}
    </section>
  );
}

export default React.memo(Home);
