export const avatarUrls = [
  "../../assets/avatars/avatar-miron-vitold.png",
  "../../assets/avatars/avatar-marcus-finn.png",
  "../../assets/avatars/avatar-iulia-albu.png",
  "../../assets/avatars/avatar-alcides-antonio.png",
  "../../assets/avatars/avatar-neha-punita.png",
  "../../assets/avatars/avatar-carson-darrin.png",
  "../../assets/avatars/avatar-seo-hyeon-ji.png",
  "../../assets/avatars/avatar-jie-yan-song.png",
  "../../assets/avatars/avatar-chinasa-neo.png",
];

export const getRandomAvatar = () => {
  return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
};
