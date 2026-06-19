/**
 * Wikipedia Commons 头像预设
 *
 * 当前为空——数据文件中已有 `person.avatar` 自定义 URL 的直接使用。
 * 其余人物由 Dicebear 首字母 SVG 自动生成，失败时降级为领域色首字母圆。
 *
 * 如需补充，请在对应区域数据文件的 person() 调用的 extra 对象中设置 avatar 属性：
 *   person('id', 'Name', 'Title', 'domain', ['region'], lng, lat, 'Bio',
 *     { avatar: 'https://example.com/portrait.jpg' })
 */

export const WIKIPEDIA_AVATAR_PRESETS: Record<string, string> = {};
