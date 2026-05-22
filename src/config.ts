const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "";

const ep = (path: string) => `${BASE_URL}${path}`;

export const API_ENDPOINTS = {
  AIG_CHAPTERS: ep("/AIG/chapters"),
  ASK_QUESTION: ep("/AIG/ask_question"),
  AZURE_DECRYPT_FUNCTION: ep("/AIG/azure_decrypt_function"),
  CHECK_BOOK: ep("/AIG/check_book"),
  CHECK_GUIDELINE: ep("/AIG/check_guideline"),
  CHECK_KB: ep("/AIG/check_kb"),
  CREATE_KNOWLEDGEBASE: ep("/AIG/create_knowledgebase"),
  DELETE_BOOK_DETAILS: ep("/AIG/delete_book_details"),
  DELETE_ALL_CHAPTER_LO_DETAILS: ep("/AIG/delete_all_chapter_lo_details"),
  DELETE_GUIDELINE: ep("/AIG/delete_guideline"),
  DELETE_GUIDELINE_DOCUMENT: ep("/AIG/delete_guideline_document"),
  DELETE_KB_DATAS: ep("/AIG/delete_kb_datas"),
  DOWNLOAD_KB_FILE: ep("/AIG/download_kb_file"),
  DOWNLOAD_STUDY_LO_TEMPLATE: ep("/AIG/download_study_lo_template"),
  GET_AGENTS: ep("/AIG/get_agents"),
  GET_AGENT_CONFIG: ep("/AIG/get_agent_config"),
  GET_APPS: ep("/AIG/get_apps"),
  GET_BOOKS_DETAILS: ep("/AIG/get_books_details"),
  GET_CHAPTER_LO_DETAILS: ep("/AIG/get_chapter_lo_details"),
  GET_CUSTOMER_DATA: ep("/AIG/get_customer_data"),
  GET_CUSTOMER_DATA_SLASH: ep("/AIG/get_customer_data/"),
  GET_EXISTING_KB: ep("/AIG/get_existing_kb"),
  GET_GENERAL_GUIDELINES: ep("/AIG/get_general_guidelines"),
  GET_GUIDELINE: ep("/AIG/get_guideline"),
  GET_KB_DETAILS: ep("/AIG/get_kb_details"),
  GET_METADATA: ep("/AIG/get_metadata"),
  GET_ORGANIZATION_DETAILS: ep("/AIG/get_organization_details"),
  GUIDELINE_SUBTYPES: ep("/AIG/guideline_subtypes"),
  GUIDELINE_TYPES: ep("/AIG/guideline_types"),
  INSERT_AGENT_CONFIG: ep("/AIG/insert_agent_config"),
  LIST_BOOK_IMAGES: ep("/AIG/list_book_images"),
  LIST_KB_FILES: ep("/AIG/list_kb_files"),
  PROCESS_DOCUMENTS: ep("/AIG/process_documents"),
  REMOVE_KB_FILES: ep("/AIG/remove_kb_files"),
  SAVE_BOOK: ep("/AIG/save_book"),
  SAVE_GUIDELINE: ep("/AIG/save_guideline"),
  SAVE_KB_GUIDELINE_MAPPING: ep("/AIG/save_kb_guideline_mapping"),
  UPDATE_CHAPTER_LO_DETAILS: ep("/AIG/update_chapter_lo_details"),
  UPDATE_KNOWLEDGEBASE: ep("/AIG/update_knowledgebase"),
  UPLOAD_STUDY_LO: ep("/AIG/upload_study_lo"),
};

const config = { BASE_URL, API_ENDPOINTS };
export default config;