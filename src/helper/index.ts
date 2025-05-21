//
import fs from "fs/promises";
//
export const readJsonArrayFromFile = async (filePath: string): Promise<string[]> => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    if (!Array.isArray(jsonData)) {
      throw new Error(`Content of ${filePath} is not a JSON array.`);
    }

    if (!jsonData.every(item => typeof item === 'string')) {
      throw new Error(`Not all items in the JSON array from ${filePath} are strings.`);
    }

    return jsonData as string[];
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in ${filePath}: ${error.message}`);
    }
    // Re-throw other errors (e.g., file not found from fs.readFile)
    // or wrap them in a custom error
    throw new Error(`Failed to read or parse JSON array from ${filePath}: ${(error as Error).message}`);
  }
};