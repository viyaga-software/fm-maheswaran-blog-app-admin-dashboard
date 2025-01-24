"use server";

import axios from "axios";
import { errResponse, getUpdatedFields } from "../utils";
import { asyncHandler, getData, getMediaData } from "./common";
import { revalidateTag } from "next/cache";

const SERVER_ONE = process.env.SERVER_ONE;

// Get All Media Files
const getAllMediaFiles = asyncHandler(async (args) => {
    const { fields = "", filters = [], pagination, sort = "", revalidate = 2, tags = [] } = args;
    const url = "/upload/files";

    const data = await getMediaData({ url, fields, filters, pagination, sort, revalidate, tags });

    if (data?.error) return { error: errResponse(data.error) };

    return data;
});

// Get Media File by ID
const getMediaFileById = asyncHandler(async ({ documentId, fields = null }) => {
    if (!documentId) return { error: "Media File ID is required." };

    let apiUrl = `${SERVER_ONE}/upload/files/${documentId}`;
    if (fields) apiUrl += `?fields=${fields}`;

    const res = await axios.get(apiUrl);

    if (!res?.data) throw new Error("Media File Not Found");

    return res?.data;
});

// Add Media File
const addMediaFile = asyncHandler(async (fileData, additionalData = {}) => {
    if (!fileData) return { error: "File data is required." };

    const formData = new FormData();
    formData.append("files", fileData);

    Object.keys(additionalData).forEach((key) => {
        formData.append(`data.${key}`, additionalData[key]);
    });

    const { data } = await axios.post(`${SERVER_ONE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    revalidateTag("mediaFiles");

    return {
        success: true,
        message: "File uploaded successfully",
        upload: data,
    };
});

const addMultipleFiles = asyncHandler(async (files, additionalData = {}) => {
    if (!files || files.length === 0) {
      return { error: "No files selected." };
    }
  
    const formData = new FormData();
  
    // Append each file to the FormData object
    files.forEach((file) => {
      formData.append("files", file);
    });
  
    // Add additional metadata to FormData
    Object.keys(additionalData).forEach((key) => {
      formData.append(`data.${key}`, additionalData[key]);
    });
  
    try {
      const { data } = await axios.post(`${SERVER_ONE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      revalidateTag("mediaFiles");
  
      return {
        success: true,
        message: "Files uploaded successfully",
        upload: data,
      };
    } catch (error) {
      console.error("Error uploading files:", error);
      return { error: "Failed to upload files." };
    }
  });
  

// Update Media File Metadata
const updateMediaFile = asyncHandler(async ({ documentId, updateData }) => {
    if (!documentId) return { error: "Media File ID is required" };

    const updatedFields = getUpdatedFields(updateData);
    if (Object.keys(updatedFields).length === 0) {
        return { error: "No fields to update" };
    }

    const { data } = await axios.put(`${SERVER_ONE}/upload/files/${documentId}`, { data: updatedFields });
    revalidateTag("mediaFiles");

    return {
        success: true,
        message: "Media File metadata updated successfully",
        upload: data,
    };
});

// Delete Media File
const deleteMediaFile = asyncHandler(async (documentId) => {
    if (!documentId) {
        return { error: "Media File ID is required" };
    }

    const { data } = await axios.delete(`${SERVER_ONE}/upload/files/${documentId}`);
    revalidateTag("mediaFiles");

    return {
        success: true,
        message: "Media File deleted successfully",
        data,
    };
});

export {
    getAllMediaFiles,
    getMediaFileById,
    addMediaFile,
    addMultipleFiles,
    updateMediaFile,
    deleteMediaFile,
};
