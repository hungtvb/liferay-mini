# Article Detail Display Page

> Trạng thái: **SOURCE READY / RUNTIME QA PENDING**

Article detail dùng **Liferay Display Page Template** để giữ friendly URL, SEO, permission và content mapping thuộc quyền quản lý của Liferay. Visual shell được version-control bằng fragment `Nexcent Article Detail`; list component chỉ điều hướng bằng `contentUrl` do Headless Delivery trả về.

## Source

```text
training/master-track-code-labs/fragments/nexcent-article-detail/
├── configuration.json
├── fragment.json
├── index.css
├── index.html
└── index.js

training/master-track-code-labs/web-content-templates/
└── nxc-article-body.ftl
```

Fragment cung cấp:

- back link;
- eyebrow và publish date;
- title, summary và author;
- cover image;
- rich-text body;
- drop zone cho OOTB Asset Categories;
- responsive layout cho desktop, tablet và mobile;
- focus state, reduced-motion support và rich-text overflow handling.

## 1. Package và import Fragment Set

Từ repository root, chạy trên Windows PowerShell:

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

Import file:

```text
training/master-track-code-labs/fragments/collections-nexcent-components.zip
```

Trong Liferay:

```text
Site Menu → Design → Fragments → Fragment Sets options → Import
```

Chọn overwrite/update để cập nhật `Nexcent Components`. Xác nhận set có fragment **Nexcent Article Detail**.

## 2. Tạo Display Page Template

Mở:

```text
Site Menu → Design → Page Templates → Display Page Templates → New
```

Tạo template:

| Thuộc tính | Giá trị |
|---|---|
| Name | `NXC Article Detail` |
| Content Type | Web Content Article |
| Subtype | `NXC Article` |
| Master Page | `Nexcent Master Page` |

Kéo fragment **Nexcent Article Detail** vào vùng content chính. Không kéo thêm wrapper ngoài nếu Master Page đã sở hữu content container/padding.

## 3. Map Article fields

Chọn từng editable trong Browser/Selection panel và map:

| Editable ID | Map tới |
|---|---|
| `title` | Web Content title |
| `summary` | `summary` |
| `authorName` | `authorName` |
| `publishedDate` | System publish date |
| `coverImage` | `coverImage` |
| `body` | `body` |

Giữ `eyebrow` là `Insights` hoặc sửa trực tiếp trong template. `backLink` mặc định trỏ về `/#articles`; chỉnh link trong Page Editor nếu landing page dùng anchor khác.

Nếu field Rich Text `body` không xuất hiện trực tiếp trong mapping selector của runtime, tạo Web Content Template từ file:

```text
training/master-track-code-labs/web-content-templates/nxc-article-body.ftl
```

Sau đó map editable `body` tới template `NXC Article Body`. Không render toàn bộ Article bằng Web Content Template; template này chỉ là fallback cho một field Rich Text.

## 4. Map topics

Trong drop zone **Article topics**, kéo OOTB fragment/widget hiển thị Asset Categories. Map nó tới current Web Content Article của Display Page Template.

Fragment detail chỉ sở hữu visual shell và drop zone. Nó không embed widget trong fragment source.

Nếu không cần taxonomy ở detail, tắt **Show Topics Slot** trong fragment configuration.

## 5. Fragment configuration

| Setting | Mặc định | Mục đích |
|---|---:|---|
| Show Back Link | Bật | Hiển thị link quay lại list |
| Background | Default | Default hoặc Surface |
| Body Width | Default | 720px, 800px hoặc 920px |
| Show Topics Slot | Bật | Hiển thị sidebar/drop zone taxonomy |

## 6. Publish và đặt default

1. Chọn **Preview With** một Article đã publish.
2. Xác nhận tất cả editable đã map, không còn placeholder.
3. Publish Display Page Template.
4. Trong Actions của template, chọn **Mark as Default** cho subtype `NXC Article`.
5. Đảm bảo Article và cover image có Guest View nếu site public.

Article list dùng `contentUrl` từ Headless Delivery nên không cần ghép URL hoặc numeric ID ở frontend.

## 7. Runtime QA

Kiểm tra một URL thật:

```text
http://localhost:8080/w/<friendly-url-path>
```

Checklist:

```text
[ ] Read more từ landing mở đúng Article
[ ] Title, summary, author, date, cover và body đúng dữ liệu
[ ] Topics lấy từ Asset Categories của Article
[ ] Back link trở về đúng section list
[ ] Cover image có alt text hợp lệ
[ ] Rich text không overflow với table, code, image hoặc URL dài
[ ] Header/Footer không bị double wrapper hoặc double padding
[ ] Không có console error hoặc request 4xx/5xx
[ ] 1440px: body + sidebar đúng layout
[ ] 768px: sidebar chuyển xuống dưới body
[ ] 375px: title, media và rich text không tạo horizontal scroll
[ ] Keyboard focus thấy rõ trên back link và body links
```

Chỉ chuyển Article gate sang PASS sau khi lưu screenshot ở cả `1440px`, `768px` và `375px`.
