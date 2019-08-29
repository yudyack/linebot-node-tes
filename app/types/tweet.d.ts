// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface Tweet {
    created_at:                string;
    id:                        number;
    id_str:                    string;
    text:                      string;
    source:                    string;
    truncated:                 boolean;
    in_reply_to_status_id:     number | null;
    in_reply_to_status_id_str: null | string;
    in_reply_to_user_id:       number | null;
    in_reply_to_user_id_str:   null | string;
    in_reply_to_screen_name:   null | string;
    user:                      User;
    geo:                       Coordinates | null;
    coordinates:               Coordinates | null;
    place:                     Place;
    contributors:              null;
    is_quote_status:           boolean;
    quote_count:               number;
    reply_count:               number;
    retweet_count:             number;
    favorite_count:            number;
    entities:                  Tweet_Entities;
    favorited:                 boolean;
    retweeted:                 boolean;
    filter_level:              FilterLevel;
    lang:                      Lang;
    timestamp_ms:              string;
    display_text_range?:       number[];
    extended_entities?:        Tweet_ExtendedEntities;
    possibly_sensitive?:       boolean;
    extended_tweet?:           ExtendedTweet;
    quoted_status_id?:         number;
    quoted_status_id_str?:     string;
    quoted_status?:            QuotedStatus;
    quoted_status_permalink?:  QuotedStatusPermalink;
}

export interface Coordinates {
    type:        CoordinatesType;
    coordinates: number[];
}

export enum CoordinatesType {
    Point = "Point",
}

export interface Tweet_Entities {
    hashtags:      Hashtag[];
    urls:          URL[];
    user_mentions: UserMention[];
    symbols:       any[];
    media?:        PurpleMedia[];
}

export interface Hashtag {
    text:    string;
    indices: number[];
}

export interface PurpleMedia {
    id:                     number;
    id_str:                 string;
    indices:                number[];
    media_url:              string;
    media_url_https:        string;
    url:                    string;
    display_url:            string;
    expanded_url:           string;
    type:                   MediaType;
    sizes:                  Sizes;
    additional_media_info?: PurpleAdditionalMediaInfo;
    video_info?:            VideoInfo;
}

export interface PurpleAdditionalMediaInfo {
    monetizable: boolean;
}

export interface Sizes {
    large:  Large;
    thumb:  Large;
    small:  Large;
    medium: Large;
}

export interface Large {
    w:      number;
    h:      number;
    resize: Resize;
}

export enum Resize {
    Crop = "crop",
    Fit = "fit",
}

export enum MediaType {
    AnimatedGIF = "animated_gif",
    Photo = "photo",
    Video = "video",
}

export interface VideoInfo {
    aspect_ratio:     number[];
    variants:         Variant[];
    duration_millis?: number;
}

export interface Variant {
    bitrate?:     number;
    content_type: ContentType;
    url:          string;
}

export enum ContentType {
    ApplicationXMPEGURL = "application/x-mpegURL",
    VideoMp4 = "video/mp4",
}

export interface URL {
    url:          string;
    expanded_url: string;
    display_url:  string;
    indices:      number[];
}

export interface UserMention {
    screen_name: string;
    name:        string;
    id:          number;
    id_str:      string;
    indices:     number[];
}

export interface Tweet_ExtendedEntities {
    media: PurpleMedia[];
}

export interface ExtendedTweet {
    full_text:          string;
    display_text_range: number[];
    entities:           Tweet_Entities;
    extended_entities?: Tweet_ExtendedEntities;
}

export enum FilterLevel {
    Low = "low",
}

export enum Lang {
    Ar = "ar",
    De = "de",
    En = "en",
    Es = "es",
    Et = "et",
    Fa = "fa",
    HT = "ht",
    In = "in",
    Is = "is",
    Sv = "sv",
    Tl = "tl",
    Und = "und",
    Zh = "zh",
}

export interface Place {
    id:           string;
    url:          string;
    place_type:   PlaceType;
    name:         string;
    full_name:    string;
    country_code: CountryCode;
    country:      Country;
    bounding_box: BoundingBox;
    attributes:   Attributes;
}

export interface Attributes {
}

export interface BoundingBox {
    type:        BoundingBoxType;
    coordinates: Array<Array<number[]>>;
}

export enum BoundingBoxType {
    Polygon = "Polygon",
}

export enum Country {
    Empty = "",
    Indonesia = "Indonesia",
    Malaysia = "Malaysia",
    Singapore = "Singapore",
    新加坡 = "新加坡",
}

export enum CountryCode {
    Empty = "",
    ID = "ID",
    My = "MY",
    Sg = "SG",
}

export enum PlaceType {
    Admin = "admin",
    City = "city",
    Country = "country",
    Poi = "poi",
}

export interface QuotedStatus {
    created_at:                string;
    id:                        number;
    id_str:                    string;
    text:                      string;
    display_text_range?:       number[];
    source:                    string;
    truncated:                 boolean;
    in_reply_to_status_id:     number | null;
    in_reply_to_status_id_str: null | string;
    in_reply_to_user_id:       number | null;
    in_reply_to_user_id_str:   null | string;
    in_reply_to_screen_name:   null | string;
    user:                      User;
    geo:                       null;
    coordinates:               null;
    place:                     Place | null;
    contributors:              null;
    is_quote_status:           boolean;
    extended_tweet?:           ExtendedTweet;
    quote_count:               number;
    reply_count:               number;
    retweet_count:             number;
    favorite_count:            number;
    entities:                  QuotedStatusEntities;
    favorited:                 boolean;
    retweeted:                 boolean;
    filter_level:              FilterLevel;
    lang:                      Lang;
    quoted_status_id?:         number;
    quoted_status_id_str?:     string;
    possibly_sensitive?:       boolean;
    extended_entities?:        QuotedStatusExtendedEntities;
}

export interface QuotedStatusEntities {
    hashtags:      Hashtag[];
    urls:          URL[];
    user_mentions: UserMention[];
    symbols:       any[];
    media?:        FluffyMedia[];
}

export interface FluffyMedia {
    id:                     number;
    id_str:                 string;
    indices:                number[];
    media_url:              string;
    media_url_https:        string;
    url:                    string;
    display_url:            string;
    expanded_url:           string;
    type:                   MediaType;
    sizes:                  Sizes;
    additional_media_info?: FluffyAdditionalMediaInfo;
    source_status_id?:      number;
    source_status_id_str?:  string;
    source_user_id?:        number;
    source_user_id_str?:    string;
    video_info?:            VideoInfo;
}

export interface FluffyAdditionalMediaInfo {
    title?:       string;
    description?: string;
    embeddable?:  boolean;
    monetizable:  boolean;
}

export interface QuotedStatusExtendedEntities {
    media: FluffyMedia[];
}

export interface User {
    id:                                 number;
    id_str:                             string;
    name:                               string;
    screen_name:                        string;
    location:                           null | string;
    url:                                null | string;
    description:                        null | string;
    translator_type:                    TranslatorType;
    protected:                          boolean;
    verified:                           boolean;
    followers_count:                    number;
    friends_count:                      number;
    listed_count:                       number;
    favourites_count:                   number;
    statuses_count:                     number;
    created_at:                         string;
    utc_offset:                         null;
    time_zone:                          null;
    geo_enabled:                        boolean;
    lang:                               null;
    contributors_enabled:               boolean;
    is_translator:                      boolean;
    profile_background_color:           string;
    profile_background_image_url:       string;
    profile_background_image_url_https: string;
    profile_background_tile:            boolean;
    profile_link_color:                 string;
    profile_sidebar_border_color:       string;
    profile_sidebar_fill_color:         string;
    profile_text_color:                 string;
    profile_use_background_image:       boolean;
    profile_image_url:                  string;
    profile_image_url_https:            string;
    profile_banner_url?:                string;
    default_profile:                    boolean;
    default_profile_image:              boolean;
    following:                          null;
    follow_request_sent:                null;
    notifications:                      null;
}

export enum TranslatorType {
    None = "none",
    Regular = "regular",
}

export interface QuotedStatusPermalink {
    url:      string;
    expanded: string;
    display:  string;
}
