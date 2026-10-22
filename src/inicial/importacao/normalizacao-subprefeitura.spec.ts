import {
  normalizarNomeSubprefeitura,
  siglaSubprefeitura,
} from './importador-planilha';

describe('normalização de subprefeituras na importação', () => {
  it('padroniza o prefixo e preserva nomes compostos por barra', () => {
    expect(normalizarNomeSubprefeitura('Santana / Tucuruvi')).toBe(
      'Subprefeitura de Santana/Tucuruvi',
    );
  });

  it('não duplica o prefixo informado na planilha', () => {
    expect(normalizarNomeSubprefeitura('subprefeitura de Santana/Tucuruvi')).toBe(
      'Subprefeitura de Santana/Tucuruvi',
    );
  });

  it('gera sigla sem acentos a partir do nome normalizado', () => {
    expect(siglaSubprefeitura('Subprefeitura da Sé')).toBe('SE');
    expect(siglaSubprefeitura('Santana / Tucuruvi')).toBe('SANTANA/TUCURUVI');
  });
});
