/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
package com.nexcent.training.exception;

import com.liferay.portal.kernel.exception.NoSuchModelException;

/**
 * @author Nexcent Training
 */
public class NoSuchImportJobException extends NoSuchModelException {

	public NoSuchImportJobException() {
	}

	public NoSuchImportJobException(String msg) {
		super(msg);
	}

	public NoSuchImportJobException(String msg, Throwable throwable) {
		super(msg, throwable);
	}

	public NoSuchImportJobException(Throwable throwable) {
		super(throwable);
	}

}