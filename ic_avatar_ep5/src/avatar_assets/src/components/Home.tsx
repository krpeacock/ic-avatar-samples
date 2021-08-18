import { ActorSubclass } from "@dfinity/agent";
import * as React from "react";
import { canisterId, createActor } from "../../../declarations/avatar";
import { Profile, _SERVICE } from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import CreateProfile from "./CreateProfile";
import Loader from "./Loader";
import ManageProfile from "./ManageProfile";
var ls = require("local-storage");

interface Props {}

function Home(props: Props) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile>();
  const { actor } = React.useContext(AppContext);

  React.useEffect(() => {
    const storedProfile = ls.get("profile");
    if (storedProfile) {
      setProfile(storedProfile as Profile);
    }
  }, []);

  React.useEffect(() => {
    actor.read().then((profile) => {
      if ("ok" in profile) {
        setProfile(profile.ok);
      } else {
        console.log(profile.err);
      }
      setIsLoaded(true);
    });
  }, [actor]);

  if (!isLoaded) {
    return (
      <section>
        <Loader />
      </section>
    );
  } else {
    return (
      <section>
        {profile ? (
          <ManageProfile profile={profile} setProfile={setProfile} />
        ) : (
          <CreateProfile actor={actor} setProfile={setProfile} />
        )}
      </section>
    );
  }
}

export default React.memo(Home);
