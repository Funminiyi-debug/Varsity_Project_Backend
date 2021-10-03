import mongoose, { Document, Types } from "mongoose";
import StaticPageStatus from "../../enums/StaticPageStatus";
interface IStaticPage {
  name: string;
  status: StaticPageStatus;
  content: string;
}

export default IStaticPage;
