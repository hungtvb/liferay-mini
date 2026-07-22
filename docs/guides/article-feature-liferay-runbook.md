# Hướng dẫn vận hành Article Feature trên Liferay

> Trạng thái: **SOURCE READY / RUNTIME QA PENDING**
>
> Áp dụng cho Liferay DXP 2026.Q1.1 LTS và branch `feat/article-content-pipeline`. Không merge PR Article trước khi import, list, detail và responsive screenshot cùng pass trên runtime thật.

## 1. Feature bao gồm những gì?

Article Feature là một pipeline hoàn chỉnh:

```text
ZIP: manifest + Excel + images
        ↓
Nexcent Content Import (Site Administration)
        ↓
REST Builder orchestration
        ↓
Service Builder ImportJob / ImportJobItem
        ↓
Article handler
        ├── Documents and Media upsert bằng ERC
        └── Structured Content upsert bằng ERC
                ↓
Headless Delivery
        ↓
<nexcent-articles> Custom Element
        ↓
Display Page Template cho trang chi tiết
```

Source chính:

| Phần | Source |
|---|---|
| Import API/handler contracts | `modules/nexcent-training/nexcent-training-api` |
| Job persistence | `modules/nexcent-training/nexcent-training-service` |
| ZIP, Excel, image và Article importer | `modules/nexcent-training/nexcent-training-article-importer` |
| REST Builder | `modules/nexcent-training/nexcent-training-rest-api`, `nexcent-training-rest-impl` |
| Site Administration UI | `modules/nexcent-training/nexcent-training-web` |
| Public Article Custom Element | `remote-apps/nexcent-articles` |
| Liferay Client Extension registration | `client-extensions/nexcent-articles-client-extension` |
| Package mẫu | `training/master-track-code-labs/sample-data/nexcent-article-import.zip` |

## 2. Điều kiện trước khi bắt đầu

Cần có:

- Java 21.
- Node.js 22+.
- Liferay DXP 2026.Q1.1 LTS đã khởi động.
- Một site có ERC `NEXCENT-PUBLIC-WEBSITE`.
- Tài khoản Site Administrator hoặc role riêng có quyền cấu hình Web Content, Documents and Media và cập nhật site.
- External host phục vụ Article app. Source mặc định dùng:
  `https://nexcent-liferay-static.vercel.app/articles`.

Khởi tạo runtime nếu chưa có:

```bash
./gradlew initBundle
blade server run
```

Portal và API Explorer:

```text
http://localhost:8080
http://localhost:8080/o/api
```

## 3. Build và deploy application modules

### 3.1. Kiểm tra generated source

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
git status --short
```

Không được có generated diff ngoài ý muốn.

### 3.2. Chạy test và build

```bash
./gradlew :modules:nexcent-training:nexcent-training-article-importer:test

./gradlew \
  :modules:nexcent-training:nexcent-training-api:build \
  :modules:nexcent-training:nexcent-training-service:build \
  :modules:nexcent-training:nexcent-training-article-importer:build \
  :modules:nexcent-training:nexcent-training-rest-api:build \
  :modules:nexcent-training:nexcent-training-rest-impl:build \
  :modules:nexcent-training:nexcent-training-web:build
```

### 3.3. Deploy vào Liferay

Deploy theo thứ tự API trước implementation:

```bash
./gradlew \
  :modules:nexcent-training:nexcent-training-api:deploy \
  :modules:nexcent-training:nexcent-training-service:deploy \
  :modules:nexcent-training:nexcent-training-article-importer:deploy \
  :modules:nexcent-training:nexcent-training-rest-api:deploy \
  :modules:nexcent-training:nexcent-training-rest-impl:deploy \
  :modules:nexcent-training:nexcent-training-web:deploy
```

Kiểm tra trong Gogo Shell:

```bash
blade sh lb | grep -i nexcent
blade sh ds:unsatisfied | grep -i nexcent
```

Kết quả mong đợi:

- Các bundle Nexcent ở trạng thái Active.
- Không có DS component Nexcent bị unsatisfied.
- API `/o/nexcent-training/v1.0` xuất hiện trong API Explorer.
- Site Menu có app **Nexcent Content Import** dưới Content & Data.

## 4. Tạo Article Structure

Mở:

```text
Site Menu → Content & Data → Web Content → Structures
```

Tạo Structure:

| Thuộc tính | Giá trị |
|---|---|
| Name | `NXC Article` |
| Key | `NXC_ARTICLE` |
| External Reference Code | `NXC-STRUCTURE-ARTICLE` |

Tạo đúng các field reference:

| Label | Field Reference | Kiểu | Required |
|---|---|---|---:|
| Summary | `summary` | Long Text | Có |
| Body | `body` | Rich Text | Có |
| Cover Image | `coverImage` | Image | Có |
| Cover Image Alt | `coverImageAlt` | Text | Có |
| Author Name | `authorName` | Text | Có |
| Featured | `featured` | Boolean | Có |
| Sort Order | `sortOrder` | Integer/Number | Có |

Không tạo custom field cho title, friendly URL, ERC, publish date, expiration date, categories, tags hoặc workflow status. Đây là field hệ thống của Web Content.

Sau khi lưu, kiểm tra API:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
```

Response phải có Structure với ERC `NXC-STRUCTURE-ARTICLE`.

## 5. Tạo taxonomy và Documents and Media folders

### 5.1. Taxonomy

Tạo vocabulary:

```text
Name: NXC Article Topics
ERC:  NXC-VOCABULARY-ARTICLE-TOPICS
```

Tạo các category mẫu:

| ERC | Name |
|---|---|
| `NXC-TOPIC-MEMBERSHIP` | Membership |
| `NXC-TOPIC-SAFEGUARDING` | Safeguarding |
| `NXC-TOPIC-COMMUNITY` | Community |
| `NXC-TOPIC-TECHNOLOGY` | Technology |

Category trong Excel được resolve bằng ERC, không dùng numeric ID.

### 5.2. Documents and Media

Tạo hai folder:

| Folder | ERC | Quyền |
|---|---|---|
| Article Assets | `NXC-FOLDER-ARTICLE-ASSETS` | Guest chỉ cần View đối với ảnh của Article public |
| Article Import Packages | `NXC-FOLDER-ARTICLE-IMPORT-PACKAGES` | Chỉ importer/admin được View và Add Document |

Package ZIP bắt buộc phải nằm trong folder import package. Backend từ chối file:

- thuộc site khác;
- nằm ngoài folder có ERC `NXC-FOLDER-ARTICLE-IMPORT-PACKAGES`;
- không phải package hợp lệ.

Trong sheet `Assets`, giá trị `folderERC` phải trùng ERC folder media thực tế. Nếu workbook mẫu dùng ERC khác, chỉnh workbook trước khi đóng ZIP hoặc tạo folder đúng ERC được khai báo trong workbook.

## 6. Tạo role và permissions

Khuyến nghị tạo Site Role:

```text
Nexcent Content Importer
```

Cấp tối thiểu:

- Site: View và Update.
- Web Content: View, Add, Update.
- Structures: View.
- Documents and Media: View, Add Document, Update.
- Folder import package: View/Add Document.
- Folder Article Assets: View/Add Document/Update.
- Taxonomy Categories: View.

Không cấp Publish mặc định. Publish nên là permission riêng dành cho Content Approver/Publisher.

REST resource hiện kiểm tra `UPDATE` trên site. D&M và Headless Delivery vẫn tiếp tục kiểm tra permission của người đang đăng nhập.

Kiểm tra negative case bằng ordinary Site Member:

- Không mở được app admin hoặc API trả 403.
- Không upload package.
- Không execute import.

## 7. Chuẩn bị package Excel và hình ảnh

Package chuẩn:

```text
nexcent-article-import.zip
├── manifest.json
├── articles.xlsx
└── assets/
    ├── article-01.jpg
    ├── article-02.png
    └── article-03.webp
```

Manifest mẫu:

```json
{
  "schemaVersion": "1.0",
  "importProfileKey": "NXC_ARTICLE_V1",
  "siteExternalReferenceCode": "NEXCENT-PUBLIC-WEBSITE",
  "defaultLanguageId": "en-US",
  "mode": "UPSERT"
}
```

Profile trong manifest phải trùng profile được chọn trên UI.

### 7.1. Sheet Articles

Giữ nguyên header và thứ tự:

```text
operation,externalReferenceCode,locale,title,friendlyUrlPath,summary,bodyHtml,coverImageKey,coverImageAlt,authorName,publicationDate,expirationDate,categoryERCs,tags,featured,sortOrder,publish
```

Quy tắc chính:

- `operation`: `UPSERT` hoặc `ARCHIVE`.
- ERC dạng `NXC-ARTICLE-...`.
- Một package không được trùng cặp `externalReferenceCode + locale`.
- Friendly URL chỉ dùng chữ thường, số và dấu gạch ngang.
- Summary dài 40–320 ký tự.
- `coverImageKey` phải tồn tại trong sheet Assets.
- Category ERC và tags phân tách bằng dấu chấm phẩy.
- Không dùng formula.
- `publish=false` cho lần chạy đầu để review Draft.

### 7.2. Sheet Assets

Header:

```text
imageKey,filePath,documentERC,title,altText,folderERC
```

Quy tắc:

- `filePath` là relative path dưới `assets/`.
- `documentERC` ổn định và không trùng.
- Chỉ hỗ trợ JPEG, PNG và WebP có magic bytes hợp lệ.
- ERC đã tồn tại ở folder khác sẽ trả `ASSET_ERC_FOLDER_CONFLICT`.
- Binary hoặc metadata thay đổi sẽ update document hiện tại.
- Binary và metadata không đổi sẽ trả `NO_CHANGE`.

### 7.3. Giới hạn an toàn

| Giới hạn | Giá trị |
|---|---:|
| ZIP nén | 25 MiB |
| Tổng expanded data | 64 MiB |
| Một ZIP entry | 15 MiB |
| Workbook | 10 MiB |
| Manifest | 64 KiB |
| ZIP entries | 256 |
| Article rows | 500 |
| Workbook sheets | 10 |

Không đưa macro, symlink, path traversal, absolute path hoặc Base64 image vào workbook/package.

## 8. Import package trong Liferay

Mở:

```text
Site Menu → Content & Data → Nexcent Content Import
```

### 8.1. Upload và validate

1. Chọn **Article** / `NXC_ARTICLE_V1`.
2. Chọn file ZIP, tối đa 25 MiB.
3. Nhấn **Upload and validate**.
4. Chờ job chuyển sang:
   - `VALIDATED`: có thể execute;
   - `INVALID`: sửa package rồi tạo/retry job;
   - `FAILED`: xem lỗi hệ thống.

UI thực hiện:

1. Tìm folder package bằng ERC qua Headless Delivery.
2. Upload ZIP vào Documents and Media.
3. Tạo durable ImportJob.
4. Parse manifest, workbook và assets.
5. Persist kết quả từng row vào ImportJobItem.

### 8.2. Review trước khi execute

Kiểm tra summary:

- Total
- Created
- Updated
- Skipped
- Failed

Kiểm tra bảng detail theo `Sheet / row`:

- `Assets`: document ERC, validation và import result.
- `Articles`: Structured Content ERC, locale và operation.

Nếu có lỗi, dùng **Download error report** để lấy CSV.

### 8.3. Execute

Chỉ nút **Execute import** khi status là `VALIDATED`.

Thứ tự execute:

1. Upsert Documents and Media assets.
2. Upsert Article rows.
3. Update job counters và row results.

Một asset hoặc Article lỗi được ghi riêng và không tự động dừng mọi row còn lại. Job kết thúc bằng:

- `COMPLETED`
- `COMPLETED_WITH_ERRORS`
- `FAILED`

Execute/retry hiện chạy đồng bộ và trả final job status. Baseline đã giới hạn 500 Article/package; workload lớn hơn phải chuyển sang Background Task hoặc Message Bus trước khi dùng production.

### 8.4. Retry và idempotency

Retry chỉ dành cho:

- `FAILED`
- `INVALID`
- `COMPLETED_WITH_ERRORS`

Import lại dữ liệu giống hệt phải trả `NO_CHANGE` và không tạo duplicate ERC. Không thay đổi package source trong D&M giữa validate và execute.

## 9. Tạo Display Page Template cho Article detail

Mở:

```text
Site Menu → Design → Page Templates → Display Page Templates
```

Tạo:

| Thuộc tính | Giá trị |
|---|---|
| Name | `NXC Article Detail` |
| Content Type | Web Content Article |
| Subtype | `NXC Article` |

Kéo các fragment và map:

| UI | Data source |
|---|---|
| H1 | Web Content title |
| Cover | `coverImage` |
| Image alt | `coverImageAlt` |
| Lead | `summary` |
| Author | `authorName` |
| Published date | System publish date |
| Body | `body` |
| Topics | Asset categories |

Publish template và đặt làm default cho Structure `NXC Article`.

Điều kiện quan trọng:

- Article phải Published.
- Article phải có quyền Guest View nếu trang public.
- Structure phải có default Display Page Template.

Khi đủ điều kiện, Headless Delivery trả `contentUrl`. Article component sử dụng chính URL này cho **Read more**; frontend không tự ghép numeric ID hoặc URL giả.

Smoke test:

```text
http://localhost:8080/w/<friendly-url-path>
```

## 10. Build và host Nexcent Articles frontend

### 10.1. Local build

```bash
cd remote-apps/nexcent-articles
npm ci
npm run typecheck
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Build output:

```text
dist/
├── index.html
├── index.js
└── style.css
```

### 10.2. External hosting

Repository Vercel assembly publish app tại:

```text
https://nexcent-liferay-static.vercel.app/articles/
```

Liferay Client Extension mặc định trỏ vào URL này. Khi dùng host khác, cập nhật `baseURL` trong:

```text
client-extensions/nexcent-articles-client-extension/client-extension.yaml
```

Host phải cho browser của người dùng truy cập được `index.js` và `style.css` qua HTTPS.

## 11. Deploy và sử dụng Article Custom Element

Deploy registration:

```bash
./gradlew :client-extensions:nexcent-articles-client-extension:deploy
```

Client Extension contract:

| Thuộc tính | Giá trị |
|---|---|
| Key | `nexcent-articles` |
| HTML element | `nexcent-articles` |
| Friendly URL mapping | `nexcent-articles` |
| Base URL | `https://nexcent-liferay-static.vercel.app/articles` |
| Structure ERC | `NXC-STRUCTURE-ARTICLE` |

Thêm vào landing page:

1. Mở Home ở Edit mode.
2. Mở Widgets/Client Extensions.
3. Tìm **Nexcent Articles**.
4. Kéo component vào vị trí tương ứng section “Caring is the new marketing”.
5. Publish page.

Component:

- Lấy site ID từ `Liferay.ThemeDisplay`.
- Resolve Structure bằng ERC/name.
- Gọi Headless Delivery với `flatten=true`.
- Chỉ render Article có title, cover image và Display Page `contentUrl`.
- Ưu tiên `featured=true`, sau đó `sortOrder`, rồi publish date.
- Hiển thị tối đa 3 card.
- Có loading, empty, error và retry.
- Responsive 3 card desktop, 2 tablet, 1 mobile.
- Không chứa business Article hard-code.

Default editable properties trên registration:

- `heading`
- `description`
- `article-structure-identifier`

## 12. Authoring hằng ngày

### Tạo Article thủ công

1. Web Content → Add → NXC Article.
2. Điền title và các field.
3. Chọn categories/tags.
4. Chọn Display Page nếu runtime chưa tự gắn default.
5. Save as Draft hoặc Publish.
6. Kiểm tra detail URL.
7. Refresh landing page; không cần rebuild frontend.

### Import hàng loạt

1. Copy workbook template.
2. Thay Article rows và images.
3. Giữ ERC ổn định qua các lần import.
4. Đóng ZIP đúng layout.
5. Upload → Validate → Review → Execute.
6. Publish/approve Draft theo workflow của site.

Không sửa trực tiếp ImportJob trong database.

## 13. API kiểm tra nhanh

### Headless Delivery

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures?pageSize=200
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents?flatten=true&page=1&pageSize=100
GET /o/headless-delivery/v1.0/structured-contents/{structuredContentId}
```

### Content Import REST Builder

```text
GET  /o/nexcent-training/v1.0/sites/{siteId}/content-import-profiles
GET  /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs
POST /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs
POST /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/validate
POST /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/execute
POST /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/retry
GET  /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/items
GET  /o/nexcent-training/v1.0/sites/{siteId}/content-import-jobs/{jobERC}/error-report
```

Dùng API Explorer để lấy request mẫu đúng với runtime; không commit Basic Auth hoặc token.

## 14. Troubleshooting

### Profile Article bị disabled

Triệu chứng:

```text
STRUCTURE_NOT_FOUND
```

Kiểm tra Structure ERC `NXC-STRUCTURE-ARTICLE` trong đúng site.

### Upload báo folder không tồn tại

Kiểm tra folder package ERC:

```text
NXC-FOLDER-ARTICLE-IMPORT-PACKAGES
```

Folder phải ở đúng site scope.

### Validate báo INVALID_PROFILE

Kiểm tra:

- UI chọn `NXC_ARTICLE_V1`.
- Manifest dùng `NXC_ARTICLE_V1`.
- schema `1.0`.
- site ERC khớp `NEXCENT-PUBLIC-WEBSITE`.

### Validate báo IMAGE_KEY_NOT_FOUND hoặc IMAGE_FILE_NOT_FOUND

Kiểm tra quan hệ:

```text
Articles.coverImageKey
→ Assets.imageKey
→ Assets.filePath
→ ZIP assets/<file>
```

Phân biệt chữ hoa/thường và không dùng đường dẫn tuyệt đối.

### Article import xong nhưng không xuất hiện ở landing

Kiểm tra:

1. Article đã Published chưa.
2. Guest có View permission chưa.
3. Article có default Display Page không.
4. Headless response có `contentUrl` không.
5. Cover image có `contentUrl` không.
6. Structure ERC đúng không.
7. External app assets có tải được không.

### Component báo Content Structure not found

Mở browser Network và kiểm tra request:

```text
/o/headless-delivery/v1.0/sites/{siteId}/content-structures
```

Nếu widget đặt trong global/asset-library scope, truyền đúng site context hoặc đặt component trên Content Page của site.

### CSS/JS cũ sau khi deploy

- Rebuild và deploy external assets.
- Purge/invalidate cache của external host.
- Kiểm tra Network đang tải `/articles/index.js` và `/articles/style.css`.
- Clear browser cache khi QA.
- Không trỏ đồng thời registration cũ `nexcent-community-app` và mới `nexcent-articles`.

## 15. Runtime QA và merge gate

Chụp cả Article list và detail ở:

```text
1440px
768px
375px
```

Checklist:

- Card layout 3/2/1 đúng static.
- Không horizontal overflow.
- Overlay, spacing, typography và màu Nexcent đúng.
- Long title không phá card.
- Broken image hiển thị fallback.
- Loading, empty và error state hoạt động.
- Keyboard focus nhìn thấy rõ.
- Read more mở đúng Display Page.
- Detail có một H1, alt text, summary, author, body và topics đúng.
- Draft/expired Article không xuất hiện với Guest.
- Admin import flow upload → validate → execute → no-change/retry hoạt động.
- Header/Footer không tạo double wrapper hoặc double padding.

Chỉ chuyển PR khỏi Draft và merge khi toàn bộ screenshot/runtime gate pass.

## 16. Rollback

Nếu Article frontend mới gặp lỗi:

1. Gỡ **Nexcent Articles** khỏi page hoặc unpublish page revision.
2. Rollback Client Extension deployment.
3. Không xóa Structure, D&M assets hoặc ImportJob.
4. Article content và detail vẫn tồn tại độc lập với frontend app.

Nếu import job lỗi:

- Không sửa database.
- Tải error report.
- Sửa package.
- Retry nếu trạng thái cho phép hoặc tạo job mới với ERC mới.
