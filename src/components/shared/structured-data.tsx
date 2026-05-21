import type { Notice } from "@/types/notice";
import type { Institution } from "@/types/institution";

type NoticeSchemaProps = {
  notice: Notice;
  baseUrl?: string;
};

export function NoticeStructuredData({ notice, baseUrl = "https://assamstudenthub.com" }: NoticeSchemaProps) {
  const noticeUrl = `${baseUrl}/notices/${notice.slug}`;
  const categoryName = notice.category || "Notice";
  const postedDate = notice.posted_at || notice.created_at;

  // Breadcrumbs schema
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${baseUrl}/categories/${categoryName.toLowerCase()}s` // e.g. /categories/exams
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": notice.title,
        "item": noticeUrl
      }
    ]
  };

  // Main entity schema: JobPosting or NewsArticle
  let mainEntitySchema: any = null;

  if (categoryName.toLowerCase() === "recruitment") {
    mainEntitySchema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": notice.title,
      "description": notice.description || notice.title,
      "datePosted": postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
      "hiringOrganization": {
        "@type": "Organization",
        "name": notice.institutions?.name || notice.source,
        "sameAs": notice.source_url
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Assam",
          "addressCountry": "IN"
        }
      },
      "url": noticeUrl
    };
  } else {
    // NewsArticle for admissions, exams, results
    mainEntitySchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": notice.title,
      "description": notice.description || notice.title,
      "datePublished": postedDate ? new Date(postedDate).toISOString() : new Date().toISOString(),
      "dateModified": notice.updated_at ? new Date(notice.updated_at).toISOString() : (postedDate ? new Date(postedDate).toISOString() : new Date().toISOString()),
      "author": {
        "@type": "Organization",
        "name": notice.source
      },
      "publisher": {
        "@type": "Organization",
        "name": "AssamStudentHub",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/favicon.ico`
        }
      },
      "mainEntityOfPage": noticeUrl
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainEntitySchema) }}
      />
    </>
  );
}

type InstitutionSchemaProps = {
  institution: Institution;
  baseUrl?: string;
};

export function InstitutionStructuredData({ institution, baseUrl = "https://assamstudenthub.com" }: InstitutionSchemaProps) {
  const institutionUrl = `${baseUrl}/institutions/${institution.slug}`;

  // Organization/EducationalOrganization schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": institution.name,
    "url": institutionUrl,
    "address": {
      "@context": "https://schema.org",
      "@type": "PostalAddress",
      "addressLocality": institution.location || "Assam",
      "addressRegion": "Assam",
      "addressCountry": "IN"
    },
    "description": `Official notifications, timetables, results and announcements from ${institution.name}.`
  };

  // Breadcrumbs schema
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Institutions",
        "item": `${baseUrl}/institutions`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": institution.name,
        "item": institutionUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}

export function WebSiteStructuredData({ baseUrl = "https://assamstudenthub.com" }) {
  const siteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/notices?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
    />
  );
}
