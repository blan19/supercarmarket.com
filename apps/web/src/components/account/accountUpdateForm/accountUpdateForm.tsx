'use client';

import Alert from 'components/common/alert';
import Button from 'components/common/button';
import { Form } from 'components/common/form';
import type { FormState } from 'constants/account';
import account from 'constants/account';
import { update } from 'feature/actions/authActions';
import { useAuthDispatch, useAuthState } from 'feature/authProvider';
import useUpdateInfo from 'hooks/queries/useUpdateInfo';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { css } from 'styled-components';

import AccountFormItem from '../accountFormItem';

const AccountUpdateForm = () => {
  const { data: session } = useSession();
  const { data: updateInfo, refetch } = useUpdateInfo(
    session?.accessToken as string
  );
  const { replace } = useRouter();
  const methods = useForm<FormState>();
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  /**
   * @function handleRequire
   * @description
   * 내 정보 수정하기의 필드는 모두 require 필드가 아님
   * 각 필드마다 입력을 받았을 때, 다른 필드의 입력이 필수인지 아닌지 핸들링하는 함수
   */
  const handleRequire = (data: FormState) => {
    const { authentication, password, newPassword, newPasswordConfirm } = data;

    return new Promise((resolve, reject) => {
      if (!password) {
        methods.setError('password', { message: '비밀번호를 입력해주세요.' });
        reject();
      }

      const isNewPasswordRequire = newPasswordConfirm && !newPassword;
      const isNewPasswordConfirmRequire = newPassword && !newPasswordConfirm;
      const isPhoneAuthRequire = state.phone.data && !authentication;
      const isNicknameRequire =
        updateInfo?.data.nickname !== data.nickname && !state.nickname.data;
      const isEmailRequire =
        updateInfo?.data.email !== data.email && !state.email.data;

      if (isNicknameRequire) {
        methods.setError('nickname', {
          message: '중복검사가 필요합니다.',
        });
        reject();
      }

      if (isEmailRequire) {
        methods.setError('email', {
          message: '중복검사가 필요합니다.',
        });
        reject();
      }

      if (isNewPasswordRequire) {
        methods.setError('newPassword', {
          message: '새 비밀번호를 입력해주세요.',
        });
        reject();
      }

      if (isNewPasswordConfirmRequire) {
        methods.setError('newPasswordConfirm', {
          message: '새 비밀번호 확인을 입력해주세요.',
        });
        reject();
      }

      if (isPhoneAuthRequire) {
        methods.setError('authentication', {
          message: '인증번호를 입력해주세요.',
        });
        reject();
      }

      resolve(true);
    });
  };

  const onSubmit = methods.handleSubmit((data) =>
    handleRequire(data).then(() => {
      if (!session?.accessToken) return;

      const { gallery, background, ...rest } = data;
      const formData = {
        ...rest,
        newPasswordCheck: rest.newPasswordConfirm || null,
        newPassword: rest.newPassword || null,
        code: rest.authentication,
      };

      update(dispatch, formData, session.accessToken).then(() => {
        refetch();
      });
    })
  );

  React.useEffect(() => {
    if (state.update.data) return replace('/');
  }, [replace, state.update.data]);

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={onSubmit}
        encType="multipart/form-data"
        css={css`
          width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 60px;
          gap: 26px;
        `}
      >
        {updateInfo && (
          <>
            {account.forms.map((form) => (
              <AccountFormItem
                key={form.htmlFor}
                defaultValue={
                  form.htmlFor !== 'authentication' &&
                  form.htmlFor !== 'password' &&
                  form.htmlFor !== 'newPassword' &&
                  form.htmlFor !== 'newPasswordConfirm'
                    ? updateInfo?.data[form.htmlFor]
                    : undefined
                }
                state={state}
                session={session}
                dispatch={dispatch}
                {...form}
              />
            ))}
            <Button type="submit" variant="Primary" width="340px">
              수정하기
            </Button>
          </>
        )}
        {state.update.error && (
          <Alert title={state.update.error.message} severity="error" />
        )}
      </Form>
    </FormProvider>
  );
};

export default AccountUpdateForm;