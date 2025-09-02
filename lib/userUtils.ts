// lib/userUtils.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createOrUpdateUserDoc = async (user: any, additionalData: { name?: string } = {}) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: user.email,
      name: additionalData.name || user.displayName || user.email.split("@")[0],
      role: "client",
      bio: "",
      department: "",
      year: "",
      phone: "",
      interests: [],
      createdAt: new Date().toISOString(),
    });
  }
};