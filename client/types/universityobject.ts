// universities.ts
import { UniversityObject } from "@/types/university";

const universities: UniversityObject[] = [
  {
    code: "skku",
    name: "Sungkyunkwan University",
    campus: "Suwon Campus",
    region: "Suwon, South Korea",
    ranking: 115,
    dorm: true,
  },
  {
    code: "ntnu",
    name: "Norwegian University of Science and Technology",
    campus: "Oslo Campus",
    region: "Oslo, Norway",
    ranking: 230,
    dorm: false,
  },
  {
    code: "skku2",
    name: "Sungkyunkwan University",
    campus: "Seoul Campus",
    region: "Seoul, South Korea",
    ranking: 115,
    dorm: true,
  }
];

export default universities;
