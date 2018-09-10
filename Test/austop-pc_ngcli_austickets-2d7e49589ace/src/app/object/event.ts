import {HtmlContent} from './html-content';

export class Event {
  createAt: number;
  eventCategory: number;
  eventCategoryName: string;
  eventCode: string;
  eventHtmlContent: HtmlContent;
  eventDescription: string;
  eventEndAt: number;
  eventId: number;
  eventImgPath: string;
  eventIsEnabled: boolean;
  eventIsFeatured: boolean;
  eventStartAt: number;
  eventTags: string;
  eventTitle: string;
  eventVenueAddress: string;
  eventVenueCountry: string;
  eventVenueLat: number;
  eventVenueLng: number;
  eventVenueName: string;
  eventVenueState: string;
  eventVenueSuburb: string;
  eventVenueZipCode: string;
  version: number;
  //
  time: string;
}
