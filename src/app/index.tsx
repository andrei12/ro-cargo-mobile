import { Stack, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { Button } from '~/src/components/Button';
import { Container } from '~/src/components/Container';
import { ScreenContent } from '~/src/components/ScreenContent';

export default function Home() {
  const { t } = useTranslation();

  const changeLanguage = async (lng: 'en' | 'ro') => {
    await i18n.changeLanguage(lng);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('homeTitle') }} />
      <Container>
        <Button
          title={t('changeLanguage')}
          onPress={() => {
            changeLanguage(i18n.language === 'en' ? 'ro' : 'en');
          }}
        />
        <ScreenContent path="app/index.tsx" title={t('homeScreen.title')}></ScreenContent>
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title={t('homeScreen.button')} />
        </Link>
      </Container>
    </>
  );
}
