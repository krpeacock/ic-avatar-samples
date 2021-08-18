import {
  ActionButton,
  Form,
  Heading,
  TextArea,
  TextField,
  Text,
} from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import React, { FormEvent } from "react";
import {
  Bio,
  Profile,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import ProfileForm from "./ProfileForm";

interface Props {
  actor: ActorSubclass<_SERVICE>;
  setProfile: React.Dispatch<Profile>;
}

const CreateProfile = (props: Props) => {
  const { actor, setLoadingMessage } = React.useContext(AppContext);

  const submitCallback = async (profile: ProfileUpdate) => {
    setLoadingMessage?.("Creating profile");
    const createResponse = await actor.create(profile);
    console.log(createResponse);
    if ("ok" in createResponse) {
      const profileResponse = await actor.read();
      if ("ok" in profileResponse) {
        props.setProfile(profileResponse.ok);
      } else {
        console.error(profileResponse.err);
      }
    } else {
      console.error(createResponse.err);
    }
    setLoadingMessage?.("");
  };

  return <ProfileForm submitCallback={submitCallback} actor={actor} />;
};

export default CreateProfile;
