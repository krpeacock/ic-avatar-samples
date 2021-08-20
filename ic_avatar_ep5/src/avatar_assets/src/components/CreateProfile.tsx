import { ActorSubclass } from "@dfinity/agent";
import { clear, remove, set } from "local-storage";
import React from "react";
import {
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import ProfileForm from "./ProfileForm";
import toast from "react-hot-toast";

interface Props {
  actor: ActorSubclass<_SERVICE>;
  setProfile: React.Dispatch<ProfileUpdate | null>;
}

const CreateProfile = (props: Props) => {
  const { actor, setIsAuthenticated } = React.useContext(AppContext);
  const { setProfile } = props;

  function handleCreationError() {
    remove("profile");
    setIsAuthenticated?.(false);
    setProfile(null);
    toast.error("There was a problem creating your profile");
  }

  const submitCallback = async (profile: ProfileUpdate) => {
    // Save profile locally
    set("profile", JSON.stringify(profile));

    // Optimistic update
    setProfile(profile);
    toast.success("Profile created");

    // Handle creation and verification async
    actor.create(profile).then(async (createResponse) => {
      if ("ok" in createResponse) {
        const profileResponse = await actor.read();
        if ("ok" in profileResponse) {
          // Do nothing, we already updated
        } else {
          console.error(profileResponse.err);
          handleCreationError();
        }
      } else {
        handleCreationError();
        console.error(createResponse.err);
      }
    });
  };

  return <ProfileForm submitCallback={submitCallback} actor={actor} />;
};

export default CreateProfile;
