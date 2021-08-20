import {
  ActionButton,
  ButtonGroup,
  Grid,
  Heading,
  Icon,
  Text,
} from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import Cancel from "@spectrum-icons/workflow/Cancel";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { remove, set } from "local-storage";
import * as React from "react";
import { useContext } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import {
  Profile,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import { compareProfiles } from "./Home";
import ProfileForm from "./ProfileForm";

const DetailsList = styled.dl`
  dd {
    margin-left: 0;
  }
`;

interface Props {
  profile: ProfileUpdate;
  setProfile: React.Dispatch<ProfileUpdate | null>;
}

function ManageProfile(props: Props) {
  const { profile, setProfile } = props;
  const { actor, setLoadingMessage } = useContext(AppContext);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    setIsEditing(false);
  }, [profile]);

  const deleteProfile = async () => {
    if (
      confirm(
        "Are you sure you want to delete your profile? This will be permanent"
      )
    ) {
      setLoadingMessage?.("Deleting your avatar");
      const result = await actor?.delete();
      toast.success("Avatar successfully deleted");
      remove("profile");
      setProfile(null);
      setLoadingMessage?.("");
      console.log(result);
    }
  };

  const compare = (updatedProfile: ProfileUpdate) => {
    return compareProfiles(profile, updatedProfile);
  };

  const submitCallback = async (profile: ProfileUpdate) => {
    // Save profile locally
    set("profile", JSON.stringify(profile));

    // Optimistically update
    setProfile(profile);
    toast.success("Avatar updated!");

    // Handle update async
    actor?.update(profile).then(async (profileUpdate) => {
      if ("ok" in profileUpdate) {
        const profileResponse = await actor.read();
        if ("ok" in profileResponse) {
          // Don't do anything if there is no difference.
          if (!compare(profileResponse.ok)) return;

          // Save profile locally
          set("profile", JSON.stringify(profileResponse.ok));
          setProfile(profileResponse.ok);
        } else {
          console.error(profileResponse.err);
          toast.error("Failed to read profile from IC");
        }
      } else {
        console.error(profileUpdate.err);
        toast.error("Failed to save update to IC");
      }
    });
  };

  if (isEditing) {
    return (
      <section>
        <Heading level={2}>Editing Profile</Heading>
        <ProfileForm
          submitCallback={submitCallback}
          actor={actor}
          initialValues={profile}
        />
        <ButtonGroup>
          <ActionButton onPress={() => setIsEditing(false)}>
            <Cancel /> <Text>Cancel</Text>
          </ActionButton>
        </ButtonGroup>
      </section>
    );
  }

  return (
    <section>
      <Heading level={2}>
        Welcome back,{" "}
        {profile.bio.displayName ?? profile.bio.givenName ?? profile.bio.name}!
      </Heading>
      <DetailsList>
        <Grid columns="1fr 1fr" gap="1rem">
          <dd>Name:</dd>
          <dt>{profile.bio.name}</dt>
          <dd>Display Name:</dd>
          <dt>{profile.bio.displayName}</dt>
          <dd>First Name:</dd>
          <dt>{profile.bio.givenName}</dt>
          <dd>Last Name:</dd>
          <dt>{profile.bio.familyName}</dt>
          <dd>location:</dd>
          <dt>{profile.bio.location}</dt>
          <dd>About:</dd>
          <dt>{profile.bio.about}</dt>
        </Grid>
      </DetailsList>
      <ButtonGroup>
        <ActionButton onPress={() => setIsEditing(true)}>
          <Edit />
          <Text>Edit</Text>
        </ActionButton>
        <ActionButton onPress={deleteProfile}>
          <Delete /> <Text>Delete</Text>
        </ActionButton>
      </ButtonGroup>
    </section>
  );
}

export default React.memo(ManageProfile);
