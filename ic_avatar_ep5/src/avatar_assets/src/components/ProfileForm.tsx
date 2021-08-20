import {
  ActionButton,
  Form,
  Heading,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { ActorSubclass } from "@dfinity/agent";
import React from "react";
import {
  Bio,
  ProfileUpdate,
  _SERVICE,
} from "../../../declarations/avatar/avatar.did";

interface Props {
  initialValues?: {
    bio: Bio;
  };
  submitCallback: (profile: ProfileUpdate) => void;
  actor?: ActorSubclass<_SERVICE>;
}

class ProfileForm extends React.Component<Props> {
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

componentDidMount(){
      if (this.props.initialValues) {
        const { about, displayName, familyName, givenName, location } =
          this.props.initialValues.bio;
        this.setState({
          about: about.shift(),
          displayName: displayName.shift(),
          familyName: familyName.shift(),
          givenName: givenName.shift(),
          location: location.shift(),
        });
      }

  }

  handleChange(key: string, value: string) {
    const newState: { [key: string]: string } = {};
    newState[key] = value;
    this.setState(newState);
  }

  async handleSubmit() {
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

    this.props.submitCallback(newProfile);
  }

  render() {
    const { about, displayName, familyName, givenName, location } = this.state;

    const handleChange = this.handleChange.bind(this);
    const handleSubmit = this.handleSubmit.bind(this);
    return (
      <section>
        <Heading level={1}>Create a Profile</Heading>
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

export default ProfileForm;
