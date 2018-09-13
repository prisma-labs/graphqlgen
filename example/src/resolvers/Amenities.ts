import { AmenitiesResolvers } from "../generated/resolvers";
import { TypeMap } from "./types/TypeMap";

export interface AmenitiesParent {
  airConditioning: boolean;
  babyBath: boolean;
  babyMonitor: boolean;
  babysitterRecommendations: boolean;
  bathtub: boolean;
  breakfast: boolean;
  buzzerWirelessIntercom: boolean;
  cableTv: boolean;
  changingTable: boolean;
  childrensBooksAndToys: boolean;
  childrensDinnerware: boolean;
  crib: boolean;
  doorman: boolean;
  dryer: boolean;
  elevator: boolean;
  essentials: boolean;
  familyKidFriendly: boolean;
  freeParkingOnPremises: boolean;
  freeParkingOnStreet: boolean;
  gym: boolean;
  hairDryer: boolean;
  hangers: boolean;
  heating: boolean;
  hotTub: boolean;
  id: string;
  indoorFireplace: boolean;
  internet: boolean;
  iron: boolean;
  kitchen: boolean;
  laptopFriendlyWorkspace: boolean;
  paidParkingOffPremises: boolean;
  petsAllowed: boolean;
  pool: boolean;
  privateEntrance: boolean;
  shampoo: boolean;
  smokingAllowed: boolean;
  suitableForEvents: boolean;
  tv: boolean;
  washer: boolean;
  wheelchairAccessible: boolean;
  wirelessInternet: boolean;
}

export const Amenities: AmenitiesResolvers.Resolver<TypeMap> = {
  airConditioning: parent => parent.airConditioning,
  babyBath: parent => parent.babyBath,
  babyMonitor: parent => parent.babyMonitor,
  babysitterRecommendations: parent => parent.babysitterRecommendations,
  bathtub: parent => parent.bathtub,
  breakfast: parent => parent.breakfast,
  buzzerWirelessIntercom: parent => parent.buzzerWirelessIntercom,
  cableTv: parent => parent.cableTv,
  changingTable: parent => parent.changingTable,
  childrensBooksAndToys: parent => parent.childrensBooksAndToys,
  childrensDinnerware: parent => parent.childrensDinnerware,
  crib: parent => parent.crib,
  doorman: parent => parent.doorman,
  dryer: parent => parent.dryer,
  elevator: parent => parent.elevator,
  essentials: parent => parent.essentials,
  familyKidFriendly: parent => parent.familyKidFriendly,
  freeParkingOnPremises: parent => parent.freeParkingOnPremises,
  freeParkingOnStreet: parent => parent.freeParkingOnStreet,
  gym: parent => parent.gym,
  hairDryer: parent => parent.hairDryer,
  hangers: parent => parent.hangers,
  heating: parent => parent.heating,
  hotTub: parent => parent.hotTub,
  id: parent => parent.id,
  indoorFireplace: parent => parent.indoorFireplace,
  internet: parent => parent.internet,
  iron: parent => parent.iron,
  kitchen: parent => parent.kitchen,
  laptopFriendlyWorkspace: parent => parent.laptopFriendlyWorkspace,
  paidParkingOffPremises: parent => parent.paidParkingOffPremises,
  petsAllowed: parent => parent.petsAllowed,
  pool: parent => parent.pool,
  privateEntrance: parent => parent.privateEntrance,
  shampoo: parent => parent.shampoo,
  smokingAllowed: parent => parent.smokingAllowed,
  suitableForEvents: parent => parent.suitableForEvents,
  tv: parent => parent.tv,
  washer: parent => parent.washer,
  wheelchairAccessible: parent => parent.wheelchairAccessible,
  wirelessInternet: parent => parent.wirelessInternet
};
