export const idlFactory = ({ IDL }) => {
  const FamilyName = IDL.Text;
  const About = IDL.Text;
  const DisplayName = IDL.Text;
  const Name = IDL.Text;
  const GivenName = IDL.Text;
  const Location = IDL.Text;
  const Bio = IDL.Record({
    'familyName' : IDL.Opt(FamilyName),
    'about' : IDL.Opt(About),
    'displayName' : IDL.Opt(DisplayName),
    'name' : IDL.Opt(Name),
    'givenName' : IDL.Opt(GivenName),
    'location' : IDL.Opt(Location),
  });
  const Wallet = IDL.Text;
  const ProfileUpdateObj = IDL.Record({
    'bio' : Bio,
    'wallets' : IDL.Opt(IDL.Vec(Wallet)),
  });
  const Profile = IDL.Record({
    'id' : IDL.Principal,
    'bio' : Bio,
    'wallets' : IDL.Opt(IDL.Vec(Wallet)),
  });
  const Response = IDL.Record({
    'code' : IDL.Nat,
    'message' : IDL.Text,
    'success' : IDL.Bool,
  });
  const Result = IDL.Variant({ 'ok' : Profile, 'err' : Response });
  return IDL.Service({
    'create' : IDL.Func([ProfileUpdateObj], [Result], []),
    'read' : IDL.Func([], [Result], ['query']),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
