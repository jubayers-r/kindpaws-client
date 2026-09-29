import { Campaign } from "@/types";

export const CampaignData: Campaign[] = [
  {
    _id: "1",
    image:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    title: "Urgent Surgery for Bruno",
    shortDescription:
      "Bruno needs urgent heart surgery to survive. Help us save him!",
    goalAmount: 1200,
    collectedAmount: 785,
    location: "Dhaka",
    ownerName: "Rescue Haven",
    longDescription:
      "Bruno was rescued with a severe heart condition that requires immediate surgery. The cost is high, and we need your support to give him a second chance. All donations go directly to the vet clinic performing the operation.",
    createdAt: new Date("2025-07-10"),
    deadline: new Date("2025-07-25"),
    tags: ["emergency", "medical", "dog"],
    ownerId: "user123",
    ownerPhoto:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    isFeatured: true,
    donations: [],
    supporters: 42,
    updates: [
      {
        message:
          "Bruno is stable after initial treatment. Awaiting surgery date confirmation.",
        date: new Date("2025-07-13"),
      },
    ],
    isOpen: true,
  },
  {
    _id: "2",
    title: "Feed Cats This Monsoon",
    shortDescription:
      "Support a community effort to feed over 100 stray cats this rainy season.",
    longDescription:
      "Rainy season hits strays hard — no shelter, no food. We're organizing a street-feeding campaign in Old Dhaka to ensure no cat goes hungry. Funds cover food, clean water, and temporary shelters.",
    image:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    goalAmount: 500,
    collectedAmount: 410,
    createdAt: new Date("2025-07-01"),
    deadline: new Date("2025-08-01"),
    tags: ["community", "cat", "food"],
    location: "Old Dhaka",
    ownerId: "user456",
    ownerName: "Street Paw Project",
    ownerPhoto:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    isFeatured: false,
    donations: [],
    supporters: 25,
    updates: [],
    isOpen: true,
  },
  {
    _id: "3",
    title: "Rebuild Local Animal Shelter",
    shortDescription:
      "Our community shelter was damaged during a storm — help us reopen our doors.",
    longDescription:
      "Last month’s storm caused major damage to our local pet shelter. With walls collapsed and roofs leaking, we’re struggling to house rescues. Help us rebuild and continue saving lives.",
    image:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    goalAmount: 2000,
    collectedAmount: 650,
    createdAt: new Date("2025-06-20"),
    deadline: new Date("2025-08-10"),
    tags: ["shelter", "rebuild", "storm"],
    location: "Chattogram",
    ownerId: "user789",
    ownerName: "Hope for Paws BD",
    ownerPhoto:
      "https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg",
    isFeatured: false,
    donations: [],
    supporters: 60,
    updates: [],
    isOpen: true,
  },
];
