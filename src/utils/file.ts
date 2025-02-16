import { unlink } from "fs/promises";
import path from "path";

/**
 * Deletes files from the filesystem.
 * @param filePaths - Array of file paths to delete.
 */
export const deleteFiles = async (filePaths: string[]) => {
	try {
		for (const filePath of filePaths) {
			const fullPath = path.resolve(__dirname, "../uploads", filePath);
			try {
				await unlink(fullPath);
				console.log(`Deleted file: ${fullPath}`);
			} catch (error: any) {
				if (error.code === "ENOENT") {
					console.warn(`File not found: ${fullPath}`);
				} else {
					throw error;
				}
			}
		}
	} catch (error) {
		console.error("Error deleting files:", error);
		throw new Error("Failed to delete one or more files.");
	}
};

/**
 * Rollbacks file uploads by deleting files if an operation fails.
 * @param reqFiles - Multer's req.files object.
 */
export const rollbackUploadedFiles = async (reqFiles: {
	[fieldname: string]: Express.Multer.File[];
}) => {
	if (reqFiles) {
		const allFilePaths = Object.values(reqFiles).flatMap((files) =>
			files.map((file) => file.path)
		);
		await deleteFiles(allFilePaths);
	}
};
