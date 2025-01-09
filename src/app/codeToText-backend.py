import os

# src 폴더 경로 (수정 필요)
src_folder = "./api"
output_file = "./src_contents.txt"

print(f"Starting to process files from: {src_folder}")
print(f"Output will be written to: {output_file}")

file_count = 0
with open(output_file, "w", encoding="utf-8") as outfile:
    for root, dirs, files in os.walk(src_folder):
        print(f"\nScanning directory: {root}")
        print(f"Found {len(files)} files in this directory")

        for file in files:
            # Skip files with 'unused' in the filename
            if 'unused' in file.lower():
                print(f"Skipping unused file: {file}")
                continue

            file_path = os.path.join(root, file)
            print(f"Processing file: {file_path}")

            try:
                # 파일 경계 표시
                outfile.write(f"\n=== FILE: {file_path} ===\n")

                # 파일 내용 읽기
                with open(file_path, "r", encoding="utf-8") as infile:
                    outfile.write(infile.read())
                file_count += 1
                print(f"Successfully processed: {file_path}")

            except Exception as e:
                print(f"ERROR processing {file_path}: {str(e)}")
                outfile.write(f"\nERROR: Unable to read file {
                              file_path}\n{e}\n")

print(f"\nProcess completed. Total files processed: {file_count}")
