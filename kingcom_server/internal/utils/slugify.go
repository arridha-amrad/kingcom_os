package utils

import (
	"regexp"
	"strings"
)

func (u *utility) ToSlug(input string) string {
	// Ubah ke huruf kecil
	slug := strings.ToLower(input)

	// Ganti semua karakter non-alfanumerik (selain spasi dan -) dengan ""
	reg := regexp.MustCompile(`[^a-z0-9\s-]`)
	slug = reg.ReplaceAllString(slug, "")

	// Ganti spasi atau lebih dengan tanda "-"
	reg = regexp.MustCompile(`[\s\-_]+`)
	slug = reg.ReplaceAllString(slug, "-")

	// Trim tanda "-" di awal/akhir
	slug = strings.Trim(slug, "-")

	return slug
}
