import * as React from "react";
import { Profile } from "../../../declarations/avatar/avatar.did";

interface Props {
  profile: Profile;
}

function ManageProfile(props: Props) {
  const { profile } = props;

  return <section>{JSON.stringify(profile)}</section>;
}

export default React.memo(ManageProfile);
