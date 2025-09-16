import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteconfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.ist.foodordering",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: "68c6ecff0002b4b35869",
  bucketId: "68c8587e0028c8e00187",
  userCollectionId: "68c70a7b000bfcc683f6",
  categoriesCollectionId: "68c8241b00346b526287",
  menuCollectionId: "68c854a80000458af652",
  customizationsCollectionId: "68c856790027903d1043",
  menuCustomizationsCollectionId: "68c85782001a6953548c",
};

export const client = new Client();

client
  .setEndpoint(appwriteconfig.endpoint)
  .setProject(appwriteconfig.projectId)
  .setPlatform(appwriteconfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);
    //maybe return immediatly
    const newUser = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.menuCollectionId,
      queries
    );
    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.categoriesCollectionId
    );
    return categories.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};
