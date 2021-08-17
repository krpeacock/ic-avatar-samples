import { ActionButton, Form, TextArea, TextField } from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import React, { FormEvent } from "react";
import {
  Bio,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";

interface Props {
  actor: ActorSubclass<_SERVICE>;
}

type BioValues = {
  [key: string]: [] | [string | undefined];
};

class CreateProfile extends React.Component<Props> {
  state = {
    about: "",
    displayName: "",
    familyName: "",
    givenName: "",
    location: "",
  };

  formRef = React.createRef();

  constructor(props: Props) {
    super(props);
  }

  handleChange(key: string, value: string) {
    const newState: { [key: string]: string } = {};
    newState[key] = value;
    this.setState(newState);
  }

  handleSubmit() {
    const { about, displayName, familyName, givenName, location } = this.state;
    let name: string = [givenName, familyName].join(" ");

    const newProfile: ProfileUpdate = {
      bio: {
        name: name ? [name] : [],
        givenName: givenName ? [givenName] : [],
        familyName: familyName ? [familyName] : [],
        displayName: displayName ? [displayName] : [],
        location: location ? [location] : [],
        about: about ? [about] : [],
      },
    };

    this.props.actor.create(newProfile).then((response) => {
      console.log(response);
    });
  }

  render() {
    const { about, displayName, familyName, givenName, location } = this.state;

    const handleChange = this.handleChange.bind(this);
    const handleSubmit = this.handleSubmit.bind(this);
    return (
      <section>
        <h1>Create Profile</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label="First Name"
            name="givenName"
            value={givenName}
            onChange={(value) => handleChange("givenName", value)}
          />
          <TextField
            label="Last Name"
            name="familyName"
            value={familyName}
            onChange={(value) => handleChange("familyName", value)}
          />
          <TextField
            label="Profile Name"
            name="displayName"
            value={displayName}
            onChange={(value) => handleChange("displayName", value)}
          />
          <TextField
            label="Location"
            name="location"
            value={location}
            onChange={(value) => handleChange("location", value)}
          />
          <TextArea
            label="About"
            name="about"
            value={about}
            onChange={(value) => handleChange("about", value)}
          />
          <ActionButton type="submit" onPress={handleSubmit}>
            Submit
          </ActionButton>
        </Form>
      </section>
    );
  }
}

export default CreateProfile;
