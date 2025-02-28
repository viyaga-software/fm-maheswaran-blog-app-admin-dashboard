import SiteSettingsViewPage from "@/components/pages/site-setting/site-setting-view-page"
import { getSettingData } from "@/lib/strapi/actions/site-setting"

const page = async () => {
    const siteSettingData = await getSettingData()
    return <SiteSettingsViewPage siteSettingData={siteSettingData} />
}

export default page
