# SBIDC

# SBI DC RC Module

This repository contains the `rc` folder and the `sbidcnew-ux.jar` file for integration with the Niagara Framework. Follow the instructions below to set up and use the code.

## Installation & Setup

1. **Copy the JAR File**
   - Locate the `sbidcnew-ux.jar` file.
   - Copy it to the following directory:
     ```
     C:\Niagara\Niagara-XX(Version)\modules
     ```
     Replace `XX(Version)` with your installed Niagara version.

2. **Copy the RC Folder**
   - Copy the entire `rc` folder from this repository.
   - Paste it into your Niagara station directory.

3. **Access the Files via Browser**
   - Open your web browser and navigate to:
     ```
     http://localhost/ord/file:%5Erc/SBIIndex.html%7Cview:webEditors:HtmlViewer
     ```
   - This will allow you to view and interact with the HTML files in the `rc` folder using the Niagara web editor.

## Notes

- Ensure your Niagara station is running before accessing the files via the browser.
- If you encounter issues, verify the paths and permissions for the copied files.

## Repository Structure

- `rc/` - Contains HTML, CSS, JS, and other resources for the SBI DC module.
- `sbidcnew-ux.jar` - Niagara module JAR file.

## Support

For further assistance, contact your system administrator or refer to the official Niagara documentation.
