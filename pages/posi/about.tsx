import ImpactPage, { PageTypes } from "../../modules/posi/impactPage";
import { posiFormData } from "../../modules/posi/input/context";
import AboutContent from "../../modules/posi/impactPage/about/AboutContent";

const posiData = posiFormData.parse({
  summary: "We taught about AI to and inspired with AI 150 kids.",
  impactedPeople: { amount: 329, howToIdentify: "asdfasdf" },
  investedTimeLevel: 3,
  tags: ["ambiente", "genero"],
  location: {
    id: "ChIJBa0PuN8oRI4RVju1x_x8E0I",
    structuredFormatting: {
      mainText: "Medellín",
      secondaryText: "Medellin, Antioquia, Colombia",
    },
    terms: [
      { offset: 0, value: "Medellín" },
      { offset: 10, value: "Medellin" },
      { offset: 20, value: "Antioquia" },
      { offset: 31, value: "Colombia" },
    ],
    types: ["locality", "political", "geocode"],
  },
  dates: {
    start: new Date("2023-03-06T05:00:00.000Z"),
    end: new Date("2023-03-09T05:00:00.000Z"),
  },
  video:
    "https://firebasestorage.googleapis.com/v0/b/weverse-72d95.appspot.com/o/80b2388e-18c6-41bc-b9e9-c81ae7039c54?alt=media&token=173fa22e-44d7-4f2d-92f8-338f3ca4584b",
  maker: {
    type: "individual",
    pic: "https://firebasestorage.googleapis.com/v0/b/weverse-72d95.appspot.com/o/d9c331f6-1210-41d7-a41f-8e3db84e75fe?alt=media&token=d771ecf3-719b-4bf7-8431-91104499c685",
    name: "adfasdf",
  },
  about: "aldkjfalksdjf",
  howToSupport: {
    contact: "Instagram - whatsgoodjd@ \n Calendar - calendar.google.com",
    finance: "https://paypal.me/jdavid10001",
  },
});

const About = () => {
  return (
    <ImpactPage
      type={PageTypes.about}
      path={"localhost"}
      description={`${posiData.summary}`}
    >
      <AboutContent {...posiData} />
    </ImpactPage>
  );
};

export default About;
