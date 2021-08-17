import { ActionButton } from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import * as React from "react";
import { Profile, _SERVICE } from "../../../declarations/avatar/avatar.did";

interface Props {
  profile: Profile;
  actor: ActorSubclass<_SERVICE>;
}

function ManageProfile(props: Props) {
  const { profile, actor } = props;

  const deleteProfile = async () => {
    const result = await actor.delete();
    console.log(result);
  };

  return (
    <section>
      {JSON.stringify(profile)}
      <ActionButton onPress={deleteProfile}>Delete Profile</ActionButton>
    </section>
  );
}

export default React.memo(ManageProfile);
