package com.nexcent.training.service.impl;

import com.nexcent.training.model.ArticleImportState;
import com.nexcent.training.service.base.ArticleImportStateLocalServiceBaseImpl;

import java.util.Date;

public class ArticleImportStateLocalServiceImpl
    extends ArticleImportStateLocalServiceBaseImpl {

    public ArticleImportState fetchArticleImportState(
        long groupId, String articleERC, String locale) {

        return articleImportStatePersistence.fetchByG_A_L(
            groupId, articleERC, locale);
    }

    public ArticleImportState updateArticleImportState(
        long companyId, long groupId, String articleERC, String locale,
        String payloadHash, long lastImportJobId) {

        ArticleImportState state =
            articleImportStatePersistence.fetchByG_A_L(
                groupId, articleERC, locale);
        Date now = new Date();

        if (state == null) {
            state = articleImportStatePersistence.create(
                counterLocalService.increment(
                    ArticleImportState.class.getName()));

            state.setCompanyId(companyId);
            state.setGroupId(groupId);
            state.setCreateDate(now);
            state.setArticleERC(articleERC);
            state.setLocale(locale);
        }

        state.setModifiedDate(now);
        state.setPayloadHash(payloadHash);
        state.setLastImportJobId(lastImportJobId);

        return articleImportStatePersistence.update(state);
    }
}
