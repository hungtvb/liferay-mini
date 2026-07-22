from pathlib import Path
import json


def replace_idempotent(path, old, new):
    file_path = Path(path)
    content = file_path.read_text()

    if old in content:
        if content.count(old) != 1:
            raise RuntimeError(f'Expected one old block in {path}')

        file_path.write_text(content.replace(old, new, 1))
    elif new not in content:
        raise RuntimeError(f'Neither old nor fixed block found in {path}')


replace_idempotent(
    'modules/nexcent-training/nexcent-training-article-importer/src/main/java/'
    'com/nexcent/training/article/importer/internal/ArticleImportManagerImpl.java',
    '''                    if ("ARCHIVE".equals(row.operation)) {
                        _archive(userId, groupId, row);
                        _markItem(item, "ARCHIVE", "INFO", StringPool.BLANK,
                            "Article expired");''',
    '''                    if ("ARCHIVE".equals(row.operation)) {
                        _archive(userId, groupId, row);
                        updatedRows++;
                        _markItem(item, "ARCHIVE", "INFO", StringPool.BLANK,
                            "Article expired");'''
)

admin_path = Path(
    'modules/nexcent-training/nexcent-training-web/src/main/resources/'
    'META-INF/resources/js/index.js'
)
admin = admin_path.read_text()

if "import ReactDOM from 'react-dom';" in admin:
    admin = admin.replace(
        "import ReactDOM from 'react-dom';",
        "import {createRoot} from 'react-dom/client';",
        1,
    )
elif "import {createRoot} from 'react-dom/client';" not in admin:
    raise RuntimeError('Admin React import is unexpected')

old_show_job = '''    const showJob = async (job) => {
        setSelectedJob(job);
        setItems([]);

        try {
            const data = await api(
                `/sites/${siteId}/content-import-jobs/` +
                    `${job.externalReferenceCode}/items?page=1&pageSize=200`
            );

            setItems(data.items || []);
        }
        catch (error) {
            setNotice({message: error.message, tone: 'danger'});
        }
    };'''
new_show_job = '''    const showJob = async (job) => {
        setSelectedJob(job);
        setItems([]);

        try {
            const values = [];
            let page = 1;

            while (true) {
                const data = await api(
                    `/sites/${siteId}/content-import-jobs/` +
                        `${job.externalReferenceCode}/items?page=${page}&pageSize=200`
                );
                const batch = data.items || [];
                const totalCount = Number(data.totalCount);

                values.push(...batch);

                if (
                    !batch.length ||
                    (Number.isFinite(totalCount) &&
                        values.length >= totalCount) ||
                    batch.length < 200
                ) {
                    break;
                }

                page += 1;
            }

            setItems(values);
        }
        catch (error) {
            setNotice({message: error.message, tone: 'danger'});
        }
    };'''

if old_show_job in admin:
    admin = admin.replace(old_show_job, new_show_job, 1)
elif new_show_job not in admin:
    raise RuntimeError('Admin pagination block is unexpected')

old_render = '''export default function main({rootId, siteId}) {
    ReactDOM.render(
        <ContentImportApp siteId={siteId} />,
        document.getElementById(rootId)
    );
}'''
new_render = '''export default function main({rootId, siteId}) {
    const rootElement = document.getElementById(rootId);

    if (!rootElement) {
        throw new Error(`Content Import root not found: ${rootId}`);
    }

    createRoot(rootElement).render(<ContentImportApp siteId={siteId} />);
}'''

if old_render in admin:
    admin = admin.replace(old_render, new_render, 1)
elif new_render not in admin:
    raise RuntimeError('Admin render block is unexpected')

admin_path.write_text(admin)

package_path = Path(
    'modules/nexcent-training/nexcent-training-web/package.json'
)
package_data = json.loads(package_path.read_text())
package_data['dependencies']['react'] = '18.2.0'
package_data['dependencies']['react-dom'] = '18.2.0'
package_path.write_text(json.dumps(package_data, indent=4) + '\n')

remote_path = Path('remote-apps/nexcent-articles/src/index.tsx')
remote = remote_path.read_text()

old_collection = '''type CollectionResponse<T> = {
    items?: T[];
};'''
new_collection = '''type CollectionResponse<T> = {
    items?: T[];
    totalCount?: number;
};'''

if old_collection in remote:
    remote = remote.replace(old_collection, new_collection, 1)
elif new_collection not in remote:
    raise RuntimeError('Article response type is unexpected')

old_loader = '''async function getStructuredContents(
    portalURL: string,
    structureId: number
): Promise<StructuredContent[]> {
    const response = await getJson<CollectionResponse<StructuredContent>>(
        `${portalURL}/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents?flatten=true&page=1&pageSize=100&sort=datePublished:desc`
    );

    return response.items ?? [];
}'''
new_loader = '''async function getStructuredContents(
    portalURL: string,
    structureId: number
): Promise<StructuredContent[]> {
    const items: StructuredContent[] = [];
    let page = 1;

    while (true) {
        const response = await getJson<CollectionResponse<StructuredContent>>(
            `${portalURL}/o/headless-delivery/v1.0/content-structures/${structureId}/structured-contents?flatten=true&page=${page}&pageSize=100&sort=datePublished:desc`
        );
        const batch = response.items ?? [];
        const totalCount = response.totalCount;

        items.push(...batch);

        if (
            !batch.length ||
            (typeof totalCount === 'number' && items.length >= totalCount) ||
            batch.length < 100
        ) {
            break;
        }

        page += 1;
    }

    return items;
}'''

if old_loader in remote:
    remote = remote.replace(old_loader, new_loader, 1)
elif new_loader not in remote:
    raise RuntimeError('Article loader block is unexpected')

remote_path.write_text(remote)
