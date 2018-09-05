import {TicketType} from './ticket-type';
import {HtmlContent} from './html-content';

export class Ticket {
  createAt: number;
  enabled: boolean;
  featured: boolean;
  maxNormalPrice: number;
  minNormalPrice: number;
  ticketCode: string;
  ticketDescription: string;
  ticketStartTime: number;
  ticketEndTime: number;
  ticketOpenUntil: number;
  ticketEvent: number;
  ticketEventCode: string;
  ticketId: number;
  ticketImgPath: string;
  ticketSeatImg: string;
  ticketTags: string;
  ticketTitle: string;
  ticketTypes: TicketType[];
  ticketVenueAddress: string;
  ticketVenueCountry: string;
  ticketVenueLat: number;
  ticketVenueLng: number;
  ticketVenueName: string;
  ticketVenueState: string;
  ticketVenueSuburb: string;
  ticketVenueZipCode: string;
  ticketHtmlContent: HtmlContent;
  ticketSaleOngoing: boolean;
  version: number;
  //
  time: string;
  price: string;
}
