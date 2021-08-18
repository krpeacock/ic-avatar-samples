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
import * as React from "react";
import { useContext } from "react";
import styled from "styled-components";
import {
  Profile,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";
import { AppContext } from "../App";
import ProfileForm from "./ProfileForm";

const DetailsList = styled.dl`
  dd {
    margin-left: 0;
  }
`;

interface Props {
  profile: Profile;
  setProfile: React.Dispatch<Profile>;
}

function ManageProfile(props: Props) {
  const { profile, setProfile } = props;
  const { actor, setLoadingMessage } = useContext(AppContext);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    setIsEditing(false);
  }, [profile]);

  const deleteProfile = async () => {
    const result = await actor.delete();
    console.log(result);
  };

  const submitCallback = async (profile: ProfileUpdate) => {
    setLoadingMessage?.("Updating your profile");
    const createResponse = await actor.update(profile);
    console.log(createResponse);
    if ("ok" in createResponse) {
      const profileResponse = await actor.read();
      if ("ok" in profileResponse) {
        setProfile(profileResponse.ok);
      } else {
        console.error(profileResponse.err);
      }
    } else {
      console.error(createResponse.err);
    }
    setLoadingMessage?.("");
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
