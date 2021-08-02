import { ic_avatar } from "../../declarations/ic_avatar";
import { ProfileUpdateObj } from "../../declarations/ic_avatar/ic_avatar.did";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = (
    document.getElementById("name") as HTMLInputElement
  ).value.toString();
  // Interact with ic_avatar actor, calling the greet method

  const profile: ProfileUpdateObj = {
    bio: {
      givenName: [],
      familyName: [],
      displayName: [],
      location: [],
      about: [],
      name: [name],
    },
    wallets: [],
  };

  const greeting = await ic_avatar.create(profile);

  document.getElementById("greeting").innerText = JSON.stringify(greeting);
});

ic_avatar.read().then((result) => {
  console.log(result);
});
