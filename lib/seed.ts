import { ID } from "react-native-appwrite";
import { appwriteconfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(appwriteconfig.databaseId, collectionId);

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteconfig.databaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteconfig.bucketId);

  await Promise.all(
    list.files.map((file) => storage.deleteFile(appwriteconfig.bucketId, file.$id))
  );
}

async function uploadImageToStorage(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const fileObj = {
    name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
    type: "image/png",
    size: blob.size,
    uri: imageUrl,
  };

  const file = await storage.createFile(appwriteconfig.bucketId, ID.unique(), fileObj);

  return storage.getFileViewURL(appwriteconfig.bucketId, file.$id);
}

console.log("1. start seed");
async function seed(): Promise<void> {
  try {
    // 1. Clear all
    await clearAll(appwriteconfig.categoriesCollectionId);
    await clearAll(appwriteconfig.customizationsCollectionId);
    await clearAll(appwriteconfig.menuCollectionId);
    await clearAll(appwriteconfig.menuCustomizationsCollectionId);
    await clearStorage();
  } catch (error) {
    console.error("clear items error", error);
  }

  // 2. Create Categories
  console.log("2. create categories");
  const categoryMap: Record<string, string> = {};

  for (const cat of data.categories) {
    const doc = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.categoriesCollectionId,
      ID.unique(),
      cat
    );
    categoryMap[cat.name] = doc.$id;
  }

  // 3. Create Customizations
  console.log("3. create customizations");
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.customizationsCollectionId,
      ID.unique(),
      {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      }
    );
    customizationMap[cus.name] = doc.$id;
  }

  // 4. Create Menu Items
  console.log("4. create menu items");
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    try {
      const uploadedImage = await uploadImageToStorage(item.image_url);

      const doc = await databases.createDocument(
        appwriteconfig.databaseId,
        appwriteconfig.menuCollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      menuMap[item.name] = doc.$id;

      // 5. Create menu_customizations
      console.log("5. create menu_customizations");
      for (const cusName of item.customizations) {
        try {
          await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.menuCustomizationsCollectionId,
            ID.unique(),
            {
              menu: doc.$id,
              customizations: customizationMap[cusName],
            }
          );
        } catch (error) {
          console.error("Menu_customizations error", error);
        }
      }
    } catch (error) {
      console.error("Menu item error:", error);
    }
  }

  console.log("✅ Seeding complete.");
}

export default seed;
