import { ActorSubclass } from "@dfinity/agent";
import * as React from "react";
import { canisterId, createActor } from "../../../declarations/avatar";
import { Profile, _SERVICE } from "../../../declarations/avatar/avatar.did";
import { AuthContext } from "../App";
import CreateProfile from "./CreateProfile";
import Loader from "./Loader";
import ManageProfile from "./ManageProfile";
var ls = require("local-storage");

interface Props {}

function Home(props: Props) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [actor, setActor] = React.useState<ActorSubclass<_SERVICE>>();
  const [profile, setProfile] = React.useState<Profile>();
  const { authClient } = React.useContext(AuthContext);

  React.useEffect(() => {
    const storedProfile = ls.get("profile");
    if (storedProfile) {
      setProfile(storedProfile as Profile);
    }
  }, []);

  React.useEffect(() => {
    if (!authClient) return;
    const identity = authClient.getIdentity();
    console.log(identity.getPrincipal().toText());
    setActor(
      createActor(canisterId as string, {
        agentOptions: {
          identity,
        },
      })
    );
  }, [authClient]);

  React.useEffect(() => {
    if (!actor) return;
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
        {profile && actor ? (
          <ManageProfile profile={profile} actor={actor} />
        ) : actor ? (
          <CreateProfile actor={actor} setProfile={setProfile} />
        ) : null}
      </section>
    );
  }
}

export default React.memo(Home);
