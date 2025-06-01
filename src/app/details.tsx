import { Stack, useLocalSearchParams } from 'expo-router';
import { Container } from '~/src/components/Container';
import { ScreenContent } from '~/src/components/ScreenContent';
import { useTranslation } from 'react-i18next';

export default function Details() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: t('detailsTitle') }} />
      <Container>
        <ScreenContent path="screens/details.tsx" title={t('detailsScreen.title', { name })} />
      </Container>
    </>
  );
}
