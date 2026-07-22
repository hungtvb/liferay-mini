/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
package com.nexcent.training.exception;

import com.liferay.portal.kernel.exception.NoSuchModelException;

/**
 * @author Nexcent Training
 */
public class NoSuchArticleImportStateException extends NoSuchModelException {

	public NoSuchArticleImportStateException() {
	}

	public NoSuchArticleImportStateException(String msg) {
		super(msg);
	}

	public NoSuchArticleImportStateException(String msg, Throwable throwable) {
		super(msg, throwable);
	}

	public NoSuchArticleImportStateException(Throwable throwable) {
		super(throwable);
	}

}