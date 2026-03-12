import mongoose, { Schema, models } from "mongoose";

const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number }, // Challenge එකේ විදිහට Price එක Optional (අනිවාර්ය නෑ)
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true }, // මේක හැදුව User ගේ ID එක
    creatorName: { type: String, required: true }, // ලේසියට User ගේ නමත් මෙතනම සේව් කරනවා
  },
  { timestamps: true } // මේකෙන් ඔටෝම පෝස්ට් එක දාපු වෙලාව (createdAt) හැදෙනවා
);

const Listing = models.Listing || mongoose.model("Listing", listingSchema);

export default Listing;