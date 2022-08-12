package main

import (
	"encoding/hex"

	"golang.org/x/crypto/nacl/secretbox"
)

func unwrap(nonce string, key string) ([24]byte, [32]byte) {
	var outNonce [24]byte
	var outKey [32]byte

	nonceBytes, err := hex.DecodeString(nonce)
	if err != nil {
		panic(err)
	}

	keyBytes, err := hex.DecodeString(nonce)
	if err != nil {
		panic(err)
	}

	copy(outNonce[:], nonceBytes)
	copy(outKey[:], keyBytes)

	return outNonce, outKey
}

func open(box string, key string, nonce string) string {
	decryptNonce, secretKey := unwrap(nonce, key)

	message, ok := secretbox.Open(nil, []byte(box), &decryptNonce, &secretKey)

	if !ok {
		panic("decryption error")
	}

	return string(message)
}

func seal(message string, nonce string, key string) string {
	encryptNonce, secretKey := unwrap(nonce, key)

	box := secretbox.Seal(nil, []byte(message), &encryptNonce, &secretKey)

	return string(box)
}
